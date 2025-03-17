import { contextBridge, ipcRenderer } from "electron";
import logger from "../../logger/logger";
import { AppConstants } from "../common/app-constants";
import path from "path";

/**
 * Exposes APIs to the renderer process through the `electronApi` object.
 */
contextBridge.exposeInMainWorld("electronApi", {
  /**
   * Registers a callback for when an operation is requested.
   *
   * @param callback - Function to handle the requested operation name.
   */
  onOperationRequested: (callback: (operationName: string) => void) => {
    logger.info(`onOperationRequested event is invoked`);
    ipcRenderer.on(
      AppConstants.IPC_HANDLERS.OPERATION_NAME,
      (event, operationName) => {
        logger.info(`operationName in callback ${operationName}`);
        callback(operationName);
      }
    );
  },

  /**
   * Sends a finish request for a specific operation with data.
   *
   * @param operationName - The name of the operation.
   * @param requestData - The data associated with the operation.
   * @returns A promise resolving with the response string from the main process.
   */
  finish: (operationName: string, requestData: object): Promise<string> => {
    const windowId = ipcRenderer.sendSync(
      AppConstants.IPC_HANDLERS.GET_WINDOW_ID
    );
    logger.info(
      `Invoking finish for windowId: ${windowId}, operationName: ${operationName}, requestData: ${requestData}`
    );
    return ipcRenderer.invoke(
      AppConstants.IPC_HANDLERS.FINISH,
      windowId,
      operationName,
      requestData
    );
  },

  /**
   * Sends a cancel request to the main process and close the window.
   */
  cancel: () => {
    const windowId = ipcRenderer.sendSync(
      AppConstants.IPC_HANDLERS.GET_WINDOW_ID
    );
    ipcRenderer.send(AppConstants.IPC_HANDLERS.CANCEL, windowId);
  },

  /**
   * Opens a directory picker dialog and retrieves the selected directory path.
   *
   * @returns A promise resolving with the selected directory path.
   */
  browseDirectoryPath: (): Promise<string> =>
    ipcRenderer.invoke(AppConstants.IPC_HANDLERS.BROWSE_DIRECTORY_PATH),

  /**
   * Retrieves the user's home directory path.
   *
   * @returns A promise resolving with the user's home directory path.
   */
  userHomeDirectory: (): Promise<string> =>
    ipcRenderer.invoke(AppConstants.IPC_HANDLERS.GET_USER_HOME_DIR),

  /**
   * Returns the platform-specific path separator.
   *
   * @returns The path separator as a string (e.g., "/" on POSIX or "\\" on Windows).
   */
  pathSeparator: () => path.sep,
});
