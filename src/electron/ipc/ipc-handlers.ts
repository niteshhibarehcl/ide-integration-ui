import { Mutex } from "async-mutex";
import { dialog, ipcMain } from "electron";
import { AppConstants } from "../common/app-constants";
import logger from "../../logger/logger";
import { APIService } from "../services/api-service";
import { windowCache } from "../controllers/ui-controller";
import os from "os";

/**
 * A class to manage IPC handlers for the Electron application.
 *
 * @export
 * @class IPCHandlers
 * @typedef {IPCHandlers}
 */
export class IPCHandlers {
  private static instance: IPCHandlers;
  private static mutex = new Mutex();
  private handlersRegistered = false;

  private constructor() {}

  /**
   * Retrieves the singleton instance of IPCHandlers.
   *
   * @returns A promise resolving with the IPCHandlers instance.
   */
  public static async getInstance(): Promise<IPCHandlers> {
    if (!IPCHandlers.instance) {
      await IPCHandlers.mutex.runExclusive(async () => {
        if (!IPCHandlers.instance) {
          IPCHandlers.instance = new IPCHandlers();
        }
      });
    }
    return IPCHandlers.instance;
  }

  /**
   * Registers all IPC handlers. Ensures handlers are registered only once.
   */
  public registerIPCHandlers = async (): Promise<void> => {
    if (this.handlersRegistered) {
      logger.info(
        "IPC Handlers are already registered. Skipping registration."
      );
      return;
    }
    logger.info("Registering IPC handlers...");
    //Ensure all IPC handlers are registered only once
    await IPCHandlers.mutex.runExclusive(async () => {
      if (!this.handlersRegistered) {
        await this.finishHandler();
        await this.cancelHandler();
        await this.getWindowIdHandler();
        await this.browseDirectoryPathHandler();
        await this.userHomeDirectoryHandler();

        this.handlersRegistered = true;
        logger.info("IPC Handlers registered successfully.");
      }
    });
  };

  /**
   * Registers the handler for the "finish" IPC event.
   */
  private finishHandler = async () => {
    ipcMain.handle(
      AppConstants.IPC_HANDLERS.FINISH,
      async (
        event,
        windowId,
        operationName: string,
        requestData: object
      ): Promise<string> => {
        logger.info(
          `Received finish event from windowId in ipc-handlers: ${windowId}`
        );
        const apiService = await APIService.getInstance();
        const token = windowCache.get(windowId)?.getToken() ?? "";
        const apiResponse: string = await apiService.invokeAPI(
          operationName,
          token,
          requestData
        );
        logger.info(`Response from API in finish handler: ${apiResponse}`);
        return apiService.handleFinishAPIResult(windowId, apiResponse);
      }
    );
  };

  /**
   * Registers the handler for the "cancel" IPC event.
   */
  private cancelHandler = async () => {
    ipcMain.on(AppConstants.IPC_HANDLERS.CANCEL, async (event, windowId) => {
      const apiService = await APIService.getInstance();
      apiService.handleCancel(windowId);
    });
  };

  /**
   * Registers the handler for the "getWindowId" IPC event.
   */
  private getWindowIdHandler = async () => {
    ipcMain.on(AppConstants.IPC_HANDLERS.GET_WINDOW_ID, (event) => {
      const windowId = event.sender.id;
      logger.info(
        `Received getWindowId event. Returning windowId: ${windowId}`
      );
      event.returnValue = windowId;
    });
  };

  /**
   * Registers the handler for the "browseDirectoryPath" IPC event.
   */
  private browseDirectoryPathHandler = async () => {
    ipcMain.handle(
      AppConstants.IPC_HANDLERS.BROWSE_DIRECTORY_PATH,
      async (): Promise<string> => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          // properties: ["openDirectory", "openFile"],
          properties: ["openDirectory"],
        });
        return canceled ? "" : filePaths[0];
      }
    );
  };

  /**
   * Registers the handler for the "getUserHomeDir" IPC event.
   */
  private userHomeDirectoryHandler = async () => {
    ipcMain.handle(
      AppConstants.IPC_HANDLERS.GET_USER_HOME_DIR,
      async (): Promise<string> => {
        const homedir = os.homedir();
        logger.info(`Received getUserHomeDir: ${homedir}`);
        return homedir;
      }
    );
  };
}