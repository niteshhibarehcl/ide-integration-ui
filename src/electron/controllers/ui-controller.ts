import { Mutex } from "async-mutex";
import * as path from "path";
import logger from "../../logger/logger";
import { AppIdleTimeoutHandler } from "../utils/app-timeout-handler";
import { BrowserWindow } from "electron";
import { AppCacheManager } from "../utils/app-cache-manager";
import { WindowData } from "../models/WindowData";
import { APIService } from "../services/api-service";
import { AppConstants } from "../common/app-constants";

/**
 * A map to store the `BrowserWindow` instances with their respective IDs.
 *
 * @type {Map<number, Electron.BrowserWindow>}
 */
//const windowMap: Map<number, Electron.BrowserWindow> = new Map();
const windowCache = new AppCacheManager<number, WindowData>();
/**
 * A singleton class to manage the UI windows in an Electron application. Responsible for launching and managing
 * `BrowserWindow` instances and maintaining their state.
 *
 * @export
 * @class UIController
 * @typedef {UIController}
 */
export class UIController {
  private static instance: UIController;
  private static mutex = new Mutex();

  private constructor() {}

  public static async getInstance(): Promise<UIController> {
    if (!UIController.instance) {
      await UIController.mutex.runExclusive(async () => {
        if (!UIController.instance) {
          UIController.instance = new UIController();
        }
      });
    }
    return UIController.instance;
  }

  /**
   * Launches a new UI window with the specified operation name. Loads the React-based frontend
   * and sends the operation name to the renderer process.The renderer process then loads the UI based on operation name.
   *
   * @async
   * @param {string} operationName - The name of the operation to be performed, passed to the frontend.
   * @returns {Promise<void>} A promise that resolves when the UI window is successfully launched.
   */
  public launchUI = async (
    operationName: string,
    token: string,
    clientResponsePid: string
  ): Promise<void> => {
    logger.info(`Launching UI for operation: ${operationName}`);
    const mainWindow = await this.createBrowserWindow();
    windowCache.set(mainWindow.id, new WindowData(token, clientResponsePid, mainWindow));

    try {
      this.loadMainWindowContent(mainWindow);
      this.setupMainWindowEvents(mainWindow, operationName);
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error(
        `Error launching UI for operation ${operationName}: ${errorMessage}`
      );
      mainWindow.close();
    }
  };

  /**
   * Creates a new `BrowserWindow` instance with predefined settings.
   *
   * @async
   * @returns {Promise<Electron.BrowserWindow>} The created `BrowserWindow` instance.
   */
  private createBrowserWindow = async (): Promise<Electron.BrowserWindow> => {
    const preloadScriptPath = path.resolve(__dirname, "preload.js");
    return new BrowserWindow({
      autoHideMenuBar: true,
      width: 550,
      height: 550,
      icon: path.resolve(__dirname, "../../../assets/icons/RCC2.ico"),
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: true,
        preload: preloadScriptPath,
      },
      show: false,
    });
  };

  /**
   * Loads the content for the `BrowserWindow` instance.
   *
   * @async
   * @param {Electron.BrowserWindow} mainWindow - The `BrowserWindow` instance to load content into.
   * @returns {Promise<void>} A promise that resolves when the content is loaded.
   */
  private loadMainWindowContent = (
    mainWindow: Electron.BrowserWindow
  ): void => {
    logger.info(`Loading UI....`);
    mainWindow.loadFile(
      path.resolve(__dirname, "../../../build/index.html")
    );
  };

  /**
   * Sets up event listeners for the `BrowserWindow` instance.
   *
   * @param {Electron.BrowserWindow} mainWindow - The `BrowserWindow` instance to set up events for.
   * @param {string} operationName - The name of the operation to send to the renderer process.
   */
  private setupMainWindowEvents = (
    mainWindow: Electron.BrowserWindow,
    operationName: string
  ): void => {
    logger.info(`configure did-on-finish`);
    mainWindow.webContents.on("did-finish-load", () => {
      logger.info(`Sending operation name to UI: ${operationName}`);
      mainWindow.webContents.send(AppConstants.IPC_HANDLERS.OPERATION_NAME, operationName);
    });

    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
      mainWindow.focus();
    });

    mainWindow.on("close", () => {
      AppIdleTimeoutHandler.resetTimeout();
      });

    mainWindow.on("closed", async () => {
      logger.info(`Closing window with ID: ${mainWindow.id}`);
      const apiService = await APIService.getInstance();
      apiService.handleCancel(mainWindow.id);
      windowCache.delete(mainWindow.id);
    });
  };
}

export { windowCache };