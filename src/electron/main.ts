import "reflect-metadata";
import { app, BrowserWindow } from "electron";
import logger from "../logger/logger";
import { initializeApp } from "./bootstrap/app-bootstrap";
import { createMainProcess } from "./bootstrap/main-process";
import { AppIdleTimeoutHandler } from "./utils/app-timeout-handler";

/**
 * Reset application timeout on startup to ensure inactivity tracking begins.
 */
AppIdleTimeoutHandler.resetTimeout();

/**
 * Main entry point for the ElectronJS application.
 *
 * Handles app initialization, lifecycle events, and error management.
 */
app.whenReady().then(async () => {
  try {
    await initializeApp();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error during app initialization";
    logger.error(`Error during app initialization: ${errorMessage}`);
    app.quit();
  }
});

/**
 * Handle the `window-all-closed` event and quits the application
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * Handle the `activate` event.
 * Recreates the main process if all windows are closed.
 */
app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    try {
      await createMainProcess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(`Error during window creation: ${errorMessage}`);
    }
  }
});
