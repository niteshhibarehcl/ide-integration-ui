import { BrowserWindow } from "electron";

/**
 * Represents the data associated with a window, including token, process ID, and the BrowserWindow instance.
 */
export class WindowData {
  /**
   * The token is used for API authorization.
   */
  private token: string;

  /**
   * he process ID of the client is used along with the response pipe to send messages to the client.
   */
  private clientResponsePid: string;


  /**
   * The BrowserWindow instance associated with the window.
   */
  private browserWindow: BrowserWindow;

  /**
   * Creates an instance of WindowData.
   *
   * @constructor
   * @param {string} token - The token used for API authorization.
   * @param {string} clientResponsePid - The process ID of the client.
   * @param {BrowserWindow} browserWindow - The BrowserWindow instance associated with the window.
   */
  constructor(token: string, clientResponsePid:string, browserWindow: BrowserWindow) {
    this.token = token;
    this.clientResponsePid = clientResponsePid;
    this.browserWindow = browserWindow;
  }

  /**
   * Retrieves the token associated with this window.
   * @returns The token as a string.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Retrieves the BrowserWindow instance.
   * @returns The BrowserWindow instance.
   */
  getBrowserWindow(): BrowserWindow {
    return this.browserWindow;
  }

  /**
   * Retrieves the client response process ID.
   * @returns The client response process ID as a string.
   */
  getClientResponsePid(): string {
    return this.clientResponsePid;
  }
}
