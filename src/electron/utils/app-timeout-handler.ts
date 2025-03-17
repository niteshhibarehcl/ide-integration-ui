import { PropertyLoadReader } from "../utils/property-load-reader";
import logger from "../../logger/logger";
import { Mutex } from "async-mutex";
import { AppConstants } from "../common/app-constants";
import { BrowserWindow } from "electron";

export class AppIdleTimeoutHandler {
  private static timeoutId: NodeJS.Timeout | null = null;
  private static readonly mutex = new Mutex();

  private constructor() {}

  /**
   * Resets the idle timeout, ensuring thread safety.
   */
  public static resetTimeout = async (): Promise<void> => {
    await this.mutex.runExclusive(async () => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // Clear existing timeout
        this.timeoutId = null;
      }
      const timeoutDuration = await this.getTimeoutDuration();
      this.timeoutId = setTimeout(async () => {
        await this.handleTimeout();
      }, timeoutDuration);
    });
  };

  /**
   * Gets the timeout duration in milliseconds.
   * @returns {Promise<number>} - The timeout duration in milliseconds.
   */
  private static async getTimeoutDuration(): Promise<number> {
    try {
      const idleTimeoutValue = await PropertyLoadReader.getProperty(
        AppConstants.IDLE_TIMEOUT
      );
      const timeoutInMinutes = idleTimeoutValue
        ? parseInt(idleTimeoutValue, 10)
        : AppConstants.DEFAULT_IDLE_TIMEOUT_IN_MINUTES;

      if (isNaN(timeoutInMinutes) || timeoutInMinutes <= 0) {
        logger.warn(
          `Invalid timeout value '${idleTimeoutValue}'. Falling back to default timeout.`
        );
        return AppConstants.DEFAULT_IDLE_TIMEOUT_IN_MINUTES * 60 * 1000;
      }
      return timeoutInMinutes * 60 * 1000; // Convert minutes to milliseconds
    } catch (error) {
      logger.error(
        "Error retrieving timeout duration. Falling back to default timeout:",
        error
      );
      return AppConstants.DEFAULT_IDLE_TIMEOUT_IN_MINUTES * 60 * 1000;
    }
  }

  /**
   * Handles the timeout logic, including checking open windows and deciding application exit.
   * @param {number} timeoutDuration - The duration of the timeout.
   */
  private static async handleTimeout(): Promise<void> {
    try {
      logger.info(`Timeout reached. Checking open windows count.`);
      const openWindowsCount = BrowserWindow.getAllWindows().length;

      if (openWindowsCount === 1) {
        logger.info(
          `No activity detected for the timeout duration. Exiting application.`
        );
        process.exit(0);
      } else {
        logger.info(
          `No activity detected, but UI windows are still open. Resetting timeout.`
        );
        await this.resetTimeout(); // Reset timeout
      }
    } catch (error) {
      logger.error("Error checking open windows count:", error);
    }
  }
}
