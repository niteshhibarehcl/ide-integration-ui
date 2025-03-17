import { BrowserWindow } from "electron";
import logger from "../../logger/logger";

/**
 * Creates a hidden background `BrowserWindow` in the Electron main process.
 *
 * This window is created with minimal dimensions and is not visible to the user.
 * It serves as a background task handler.
 *
 * @async
 * @function createMainProcess
 * @returns {Promise<void>} Resolves when the window is created successfully.
 */
export const createMainProcess = async (): Promise<void> => {
  try {
    new BrowserWindow({
      width: 50,
      height: 50,
      show: false,
    });
    logger.debug("Background BrowserWindow process created successfully.");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        `Error occurred while creating hidden background window: ${error.message}`
      );
    } else {
      logger.error(
        "Unknown error occurred while creating hidden background window:"
      );
    }
    throw error;
  }
};
