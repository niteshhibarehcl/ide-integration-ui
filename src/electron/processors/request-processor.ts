import logger from "../../logger/logger";
import { OperationRequestData } from "../models/OperationRequestData";
import { buildApiResponse, isValidValue, transformJsonToInstance } from "../utils/app-utils";
import { NamedPipeUtils } from "../pipe/namedpipe-utils";
import { UIController } from "../controllers/ui-controller";
import { Constants } from "../../shared/constants";

/**
 * A class representing a process request that validates and executes operations based on request data.
 *
 * @export
 * @class RequestProcessor
 * @typedef {RequestProcessor}
 */
export class RequestProcessor {

  constructor() {}

  /**
   * Process the request by validating the request data and launching the UI if the data is valid.
   *
   * @public
   * @async
   * @returns {Promise<void>}  A promise that resolves when the request execution is complete.
   */
  public processRequest = async (request: string): Promise<void> => {
    try {
      const requestData: OperationRequestData =
        transformJsonToInstance<OperationRequestData>(
          request,
          OperationRequestData
        );
      const isValidData: boolean = this.validateRequestData(requestData);
      if (isValidData) {
        const uiController: UIController = await UIController.getInstance();
        uiController.launchUI(
          requestData.getOperationName(),
          requestData.getCommunication().getToken(),
          requestData.getCommunication().getResponsePipe()
        );
      }
    } catch (error) {
      logger.error(`Error: ${(error as Error).message}`);
    }
  };

  /**
   * Validates the parsed input data for completeness and correctness.
   *
   * @private
   * @param {OperationRequestData} data - The parsed operation request data to validate.
   * @returns {boolean} `true` if the input data is valid; otherwise, throw error with message.
   */
  private validateRequestData(data: OperationRequestData): boolean {
    if (null != data) {
      //validate communication object
      if (!data.getCommunication()) {
        logger.error(`Communication data is missing in input data`);
        throw new Error(`Communication data is missing in input data`);
      }
      //validate responsePipe
      if (!data.getCommunication().getResponsePipe()) {
        logger.error(`ResponsePipe is missing in input data`);
        throw new Error(`ResponsePipe is missing in input data`);
      }
      //validate operationName
      if (!data.getOperationName()) {
        logger.error(`OperationName is missing in input data`);
        NamedPipeUtils.writeDataToResponsePipe(
          data.getCommunication().getResponsePipe(),
          buildApiResponse(400, `OperationName is missing in input data`)
        );
        throw new Error(`OperationName is missing in input data`);
      }
      if (!isValidValue(Constants.OPERATION_NAMES, data.getOperationName())) {
        logger.error(`Invalid OperationName: ${data.getOperationName()}`);
        NamedPipeUtils.writeDataToResponsePipe(
          data.getCommunication().getResponsePipe(),
          buildApiResponse(400, `Invalid OperationName: ${data.getOperationName()}`)
        );
        throw new Error(`Invalid OperationName: ${data.getOperationName()}`);
      }
    }
    return true;
  }
}
