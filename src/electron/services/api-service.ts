import { Mutex } from "async-mutex";
import { generateRandomName, transformInstanceToJson } from "../utils/app-utils";
import logger from "../../logger/logger";
import { NamedPipeHandler } from "../pipe/namedpipe-handler";
import { OperationRequestData } from "../models/OperationRequestData";
import { Communication } from "../models/Communication";
import { windowCache } from "../controllers/ui-controller";
import { NamedPipeUtils } from "../pipe/namedpipe-utils";
import { APIResponse } from "../models/APIResponse";

/**
 * A singleton service class to manage API invocations through named pipes.
 */
export class APIService {
  private static instance: APIService;
  private static mutex = new Mutex();
  static apiService: APIService;

  private constructor() {}

  /**
   * Returns the singleton instance of the `APIService` class, creating it if it does not already exist.
   *
   * @returns {Promise<APIService>} A promise that resolves to the `APIService` singleton instance.
   */
  public static getInstance = async (): Promise<APIService> => {
    if (!APIService.instance) {
      await APIService.mutex.runExclusive(async () => {
        if (!APIService.instance) {
          APIService.instance = new APIService();
        }
      });
    }
    return APIService.instance;
  };

  /**
   * Invokes an API operation by preparing a request payload, sending it through a named pipe,
   * and receiving the response.
   *
   * @param {string} operationName - The name of the operation to be invoked.
   * @param {string} token - The authorization token for the API operation.
   * @param {object} operationArguments - The arguments required for the operation.
   * @returns {Promise<string>} A promise that resolves to the API response as a string.
   */
  public invokeAPI = async (
    operationName: string,
    token: string,
    operationArguments: object
  ): Promise<string> => {
    let response: string = "";
    try {
      const pid = generateRandomName();
      const requestPayload = await this.prepareAPIRequest(
        operationName,
        token,
        operationArguments,
        pid
      );
      response = await this.handleAPICommunication(requestPayload, pid);
    } catch (error) {
      this.handleError(error);
      throw new Error(`An error occurred during API call: ${error}`);
    }
    return response;
  };

  /**
   * Prepares an API request payload in JSON format.
   *
   * @param {string} operationName - The name of the operation to be invoked.
   * @param {string} token - The authorization token for the API operation.
   * @param {object} operationArguments - The arguments required for the operation.
   * @param {string} responsePipeName - The named pipe to receive the response.
   * @returns {string} The prepared API request payload as a JSON string.
   */
  private prepareAPIRequest = async (
    operationName: string,
    token: string,
    operationArguments: object,
    pid: string
  ): Promise<string> => {
    const communication = new Communication(pid, token);
    const operationRequestData = new OperationRequestData(
      operationName,
      communication,
      operationArguments
    );
    const requestPayload = transformInstanceToJson(operationRequestData);
    logger.info(`Prepared API Request: ${requestPayload}`);
    return requestPayload;
  };

  /**
   * Handles API communication by sending a request payload and receiving the response over pipes.
   *
   * @param {string} requestPayload - The API request payload to be sent.
   * @param {string} pid - The named pipe to receive the response.
   * @returns {Promise<string>} A promise that resolves to the API response as a string.
   */
  private handleAPICommunication = async (
    requestPayload: string,
    pid: string
  ): Promise<string> => {
    const namedPipeHandler = await NamedPipeHandler.getInstance();
    // Send request to proxy server
    await namedPipeHandler.sendDataToListenerPipe(requestPayload);
    // Receive response from proxy server
    const response = await namedPipeHandler.receiveResponse(pid);
    logger.info(`Received API Response: ${response}`);
    return response;
  };

  /**
   * Logs and handles errors that occur during API invocation.
   *
   * @param {Error | unknown} error - The error object encountered during API invocation.
   */
  private handleError = (error: Error | unknown, pid?: string): void => {
    const requestId = pid ? `[Request ID: ${pid}]` : "";
    if (error instanceof Error) {
      logger.error(`[APIService][Error] ${requestId} ${error.message}`, error);
    } else {
      logger.error(
        `[APIService][Error] ${requestId} Unknown error occurred: ${error}`
      );
    }
  };

  /**
   * Handles the API response received from the proxy server by sending it to the client response pipe.
   *
   * @param {number} windowId - The ID of the window that initiated the API request
   * @param {string} apiResponse - The API response received from the proxy server
   * @returns {string} The error message, if any, encountered during API response handling.
   */
  public handleFinishAPIResult = async (
    windowId: number,
    apiResponse: string
  ): Promise<string> => {
    try {
      if (apiResponse) {
        const response = JSON.parse(apiResponse);
        if (response.responseCode === 200) {
         await this.sendResponseAndCloseWindow(windowId, apiResponse);
        } else {
          return response.responseMsg;
        }
      }
    } catch (error) {
      logger.error(`[APIService][Error] Invalid API response: ${apiResponse}`);
      throw error;
    }
    return "";
  };

  /**
   * Handles the cancellation of an API operation by sending a response to the client response pipe and closing the window.
   *
   * @async
   * @param {number} windowId - The ID of the window that initiated the API request
   * @returns {Promise<void>} A promise that resolves when the operation is successfully cancelled.
   */
  public handleCancel = async (windowId: number): Promise<void> => {
    this.sendResponseAndCloseWindow(windowId, JSON.stringify(new APIResponse(200, "Operation is cancelled by user")));
  };

  /**
   * Sends the API response to the client response pipe and closes the window.
   *
   * @async
   * @param {number} windowId - The ID of the window that initiated the API request
   * @param {string} apiResponse - The API response to be sent to the client response pipe
   * @returns {Promise<void>} A promise that resolves when the response is successfully sent and the window is closed.
   */
  private sendResponseAndCloseWindow = async (
    windowId: number,
    apiResponse: string
  ): Promise<void> => {
    const windowData = windowCache.get(windowId);
    if (windowData) {
      const clientResponsePid: string = windowData.getClientResponsePid();
      await NamedPipeUtils.writeDataToResponsePipe(clientResponsePid, apiResponse);
      windowCache.delete(windowId);
      const browserWindow = windowData.getBrowserWindow();
      browserWindow?.close();
    }
  };
}