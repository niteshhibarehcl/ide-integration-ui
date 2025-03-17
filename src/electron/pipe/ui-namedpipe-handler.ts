import { Mutex } from "async-mutex";
import { NamedPipeUtils } from "./namedpipe-utils";
import logger from "../../logger/logger";
import net from "net";
import { isWindowsOS } from "../utils/app-utils";
import { RequestQueueHandler } from "../processors/request-queue-handler";

/**
 * Handles UI named pipe operations for interprocess communication.
 *
 * This class provides functionality to listen on a named pipe for incoming requests from UI clients,
 * dynamically create the required pipe paths, and process incoming requests on both Windows and Linux platforms.
 *
 * - Manages the lifecycle of a UI listener pipe.
 * - Supports dynamic creation of named pipes based on platform.
 *
 * @export
 * @class UiNamedPipeHandler
 * @typedef {UiNamedPipeHandler}
 */
export class UiNamedPipeHandler {
  private static UI_LISTENER_PIPE_NAME = "IDE_Listener_UI";
  private static instance: UiNamedPipeHandler;
  private static mutex = new Mutex();

  private constructor() {}

  /**
   * Retrieves the singleton instance of the `UiNamedPipeHandler` class.
   * Ensures thread-safe creation of the instance using a mutex to handle concurrency.
   *
   * @public
   * @static
   * @async
   * @returns {Promise<UiNamedPipeHandler>} A promise that resolves to the singleton instance of `UiNamedPipeHandler`.
   */
  public static async getInstance(): Promise<UiNamedPipeHandler> {
    if (!UiNamedPipeHandler.instance) {
      await UiNamedPipeHandler.mutex.runExclusive(async () => {
        if (!UiNamedPipeHandler.instance) {
          UiNamedPipeHandler.instance = new UiNamedPipeHandler();
        }
      });
    }
    return UiNamedPipeHandler.instance;
  }

  /**
   * This method checks the availability of the UI listener pipe.
   * If the pipe is unavailable, it initiates the creation of the pipe.
   *
   * @async
   * @returns {*} Resolves when the pipe is confirmed to be created or already available.
   */
  public static startUIListenerPipe = async (): Promise<void>  => {
    const uiListenerPipe = NamedPipeUtils.getListenerPipe(
      UiNamedPipeHandler.UI_LISTENER_PIPE_NAME
    );
    const isListenerPipeAvailable = await NamedPipeUtils.isNamedPipeAvailable(
      uiListenerPipe
    );
    if (!isListenerPipeAvailable) {
      logger.info(`Starting the UI listener pipe.`);
      await UiNamedPipeHandler.mutex.runExclusive(async () => {
        await this.createUIListenerPipe(uiListenerPipe);
      });
    }
  };

  /**
   * Creates a UI listener pipe for handling incoming requests.
   * This method initializes a named pipe server to listen for incoming requests.
   * If running on a Linux, it ensures the named pipe path is created before starting.
   *
   * @async
   * @param {string} namedPipe - The path of the named pipe to be created.
   * @returns {*} Resolves when the listener is set up.
   */
  private static createUIListenerPipe = async (namedPipe: string): Promise<void>  => {
    if (!isWindowsOS()) {
      await NamedPipeUtils.createLinuxNamedPipePath(namedPipe);
    }
    try {
      const server = net.createServer((stream) => {
        stream.on("data", async (chunk) => {
          (await RequestQueueHandler.getInstance()).enqueueRequest(chunk);
        });

        stream.on("error", (error) => {
          logger.error(`An error creating UI listener pipe: ${error}`);
        });
      });

      server.listen(namedPipe, () => {
        logger.info(`The UI server is listening on named pipe: ${namedPipe}`);
      });

      server.on("error", (error) => {
        logger.error(
          `An error occurred while creating UI listener pipe: ${error}`
        );
      });
    } catch (err) {
      logger.error(`An error occurred while creating server: ${err}`);
    }
  };
}
