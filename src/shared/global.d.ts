/**
 * Defines the Electron API interface exposed to the renderer process.
 *
 * @export
 * @interface ElectronAPI
 * @typedef {ElectronAPI}
 */
export interface ElectronAPI {
  /**
   * Registers a callback to be invoked when an operation name is received.
   *
   * @param callback - A function that receives the operation name as a string.
   */
  onOperationRequested: (callback: (name: string) => void) => void;

  /**
   * Marks an operation as finished with the given name and request data.
   * This is invoked on the submission of the form and calls the API from the proxy server.
   * If the operation is successful, it writes the response to the response pipe and closes the window.
   *
   * @param operationName - The name of the operation.
   * @param requestData - An object containing the request data for the operation.
   * @returns A promise that resolves to a string result.
   */
  finish: (operationName: string, requestData: object) => Promise<string>;

  /**
   * Cancels the current operation and closes the window.
   */
  cancel: () => void;

  /**
   * Opens a directory browser dialog and returns the selected directory path.
   * @returns A promise that resolves to the selected directory path as a string.
   */
  browseDirectoryPath: () => Promise<string>;

  /**
   * Retrieves the user's home directory path.
   * @returns A promise that resolves to the user's home directory path as a string.
   */
  userHomeDirectory: () => Promise<string>;

  /**
   * Returns the operating system-specific path separator.
   * @returns A string representing the path separator (e.g., "/" or "\\").
   */
  pathSeparator: () => string;
}

/**
 * Extends the global `Window` interface to include the `electronApi` property.
 */
declare global {
  interface Window {
    electronApi: ElectronAPI;
  }
}
