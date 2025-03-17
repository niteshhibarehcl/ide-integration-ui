import { createMainProcess } from "./main-process";
import logger from "../../logger/logger";
import { UiNamedPipeHandler } from "../pipe/ui-namedpipe-handler";
import { PropertyLoadReader } from "../utils/property-load-reader";
import { dialog } from "electron";
import i18next, { i18nextInitPromise } from "../../i18n/i18nxt";
import { AppIdleTimeoutHandler } from "../utils/app-timeout-handler";
import { IPCHandlers } from "../ipc/ipc-handlers";

/**
 * Initializes the application.
 *
 * This function performs several key initialization tasks:
 * - Ensures that i18next (internationalization library) is initialized.
 * - Loads the configuration properties from the property file.
 * - Starts the UI listener pipe for inter-process communication.
 * - Creates the main background process
 *
 * @throws Will throw an error if any of the initialization steps fail and displays an error dialog to the user..
 */
export const initializeApp = async (): Promise<void> => {
  try {
    // Wait for i18next to finish initialization
    await i18nextInitPromise;

    // Load configuration properties
    await (await PropertyLoadReader.getInstance()).loadConfigPropertyFile();

    // Start the UI listener pipe for IPC
    await UiNamedPipeHandler.startUIListenerPipe();

    // Create the main process components
    await createMainProcess();

    //register IPC handlers
    (await IPCHandlers.getInstance()).registerIPCHandlers();

    // Reset timeout to ensure the application remains active
    AppIdleTimeoutHandler.resetTimeout();

    logger.info(`Application initialized successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error occurred while initializing app: ${error.message}`);
      dialog.showErrorBox(i18next.t("error"), error.message);
    } else {
      logger.error("Unknown error occurred while initializing app");
      dialog.showErrorBox(i18next.t("error"), "Unknown error");
    }
    throw error;
  }
};
