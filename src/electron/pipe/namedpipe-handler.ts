import { Mutex } from "async-mutex";
import { NamedPipeUtils } from "./namedpipe-utils";
import logger from "../../logger/logger";
import net from "net";
import { exec } from "child_process";
import { isWindowsOS, sleep } from "../utils/app-utils";

/**
 * Handles communication through named pipes, including sending data, receiving responses,
 * and managing the availability of a proxy server.
 *
 * ### Key Features:
 * - Sends data to a named pipe, ensuring the pipe is available.
 * - Receives responses from a named pipe asynchronously.
 * - Manages the lifecycle of a proxy server, starting it if necessary.

* @export
 * @class NamedPipeHandler
 * @typedef {NamedPipeHandler}
 */
export class NamedPipeHandler {
  private static LISTENER_PIPE_NAME = "IDE_Listener";
  private static SLEEP_TIME = 2000;
  private static MAX_RETRIES = 100;
  private static instance: NamedPipeHandler;
  private static mutex = new Mutex();

  private constructor() {}

  /**
   * Retrieves the singleton instance of the `NamedPipeHandler` class.
   * Ensures thread-safe creation of the instance using a mutex to handle concurrency.
   *
   * @public
   * @static
   * @async
   * @returns {Promise<NamedPipeHandler>} A promise that resolves to the singleton instance of `NamedPipeHandler`.
   */
  public static async getInstance(): Promise<NamedPipeHandler> {
    if (!NamedPipeHandler.instance) {
      await NamedPipeHandler.mutex.runExclusive(async () => {
        if (!NamedPipeHandler.instance) {
          NamedPipeHandler.instance = new NamedPipeHandler();
        }
      });
    }
    return NamedPipeHandler.instance;
  }

  /**
   * Sends data to the listener pipe after ensuring its availability.
   * Retries until the listener pipe is available or the maximum retries are reached.
   *
   * @async
   * @param {string} data - The data to send to the listener pipe.
   * @returns {*} Resolves once the data is written or an error occurs.
   */
  public sendDataToListenerPipe = async (data: string): Promise<void> => {
    const listenerPipe = NamedPipeUtils.getListenerPipe(
      NamedPipeHandler.LISTENER_PIPE_NAME
    );
    logger.debug(`Connecting to to listener pipe ${listenerPipe}`);
    for (let retry = 0; retry < NamedPipeHandler.MAX_RETRIES; retry++) {
      try {
        const isPipeAvailable = await NamedPipeUtils.isNamedPipeAvailable(
          listenerPipe
        );
        if (isPipeAvailable) {
          logger.debug(
            `Listener pipe is available. Starting to write data to the listener pipe.`
          );
          setTimeout(() => {
            NamedPipeUtils.writeDataToNamedPipe(listenerPipe, data);
          }, NamedPipeHandler.SLEEP_TIME); // Delay for 2 second
          return;
        }
          logger.info(`The proxy server is not running. Starting it now.`);
          await this.startProxyServer();
          await sleep(3000);
      } catch (error) {
        logger.error(
          `Error occurred while sending data to listener pipe: ${error}`
        );
        throw error;
      }
      await sleep(NamedPipeHandler.SLEEP_TIME);
    }
    logger.error("Max retries reached. Failed to send data to listener pipe.");
  };

  /**
   * This method sets up a server to listen on the given response pipe,
   * collects data from the stream, and resolves the full response once the stream ends.
   * If an error occurs, the error message is resolved instead.
   *
   * @async
   * @param {string} pid - The unique response pipe ID to listen on for responses.
   * @returns {Promise<string>} A promise that resolves with the received data or an error message.
   */
  public receiveResponse = async (pid: string): Promise<string> => {
    const responsePipe = NamedPipeUtils.getResponsePipe(pid);
    return new Promise((resolve) => {
      const server = net.createServer((stream) => {
        let dataBuffer = "";
        stream.on("data", (chunk) => {
          dataBuffer += chunk.toString();
        });
        stream.on("end", () => {
          // Once the stream ends, resolve the full data
          logger.debug(
            `Successfully received a response from the backend through the ${responsePipe} pipe: ${dataBuffer}`
          );
          resolve(dataBuffer);
          stream.end();
          server.close(); //this need be tested
        });

        stream.on("error", (chunk) => {
          logger.error(
            `Error occurred while reading the response from the ${responsePipe} pipe: ${chunk.toString()}`
          );
          resolve(chunk.toString());
          server.close(); //this need be tested
        });
      });

      server.listen(responsePipe, () => {
        logger.info(`Server listening on pipe ${responsePipe}`);
      });
    });
  };

  /**
   * Starts the proxy server if it is not already running and creates listener pipe
   *
   * - For Windows, the `restcmapi.bat` script is executed.
   * - For Linux systems, the `restcmapi.sh` script is executed.
   *
   * @async
   * @returns {*} A promise that resolves when the operation completes.
   */
  private startProxyServer = async (): Promise<void> => {
    if (!(await this.isProxyServerRunning())) {
      const PROCESS_NAME: string = isWindowsOS()
        ? "restcmapi.bat"
        : "restcmapi.sh";
      const command = `"${PROCESS_NAME}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(
            `Error occurred while executing server startup script: ${error.message}`
          );
          return;
        }

        if (stderr) {
          logger.error(
            `Error occurred while executing server startup script: ${stderr}`
          );
          return;
        }

        logger.debug(`Proxy server has started successfully.`);
      });
    }
  };

  /**
   * Checks if the proxy server is running by verifying the availability of the listener pipe.
   *
   * @async
   * @returns {Promise<boolean>} A promise that resolves to `true` if the listener pipe is available, otherwise `false`.
   */
  private isProxyServerRunning = async (): Promise<boolean> => {
    const listenerPipe = NamedPipeUtils.getListenerPipe(
      NamedPipeHandler.LISTENER_PIPE_NAME
    );
    return await NamedPipeUtils.isNamedPipeAvailable(listenerPipe);
  };
}
