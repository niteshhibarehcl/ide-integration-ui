import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import logger from "../../logger/logger";
import net from "net";
import os from "os";
import { isWindowsOS } from "../utils/app-utils";

/**
 * Utility class for handling operations related to named pipes.
 *
 * @export
 * @class NamedPipeUtils
 * @typedef {NamedPipeUtils}
 */
export class NamedPipeUtils {
  /**
   * Delimiter used to replace the user's home directory placeholder in the base pipe path
   *
   * @private
   * @static
   * @type {string}
   */
  private static USER_HOME_DELIMITER = "@user_name@";

  /**
   * Delimiter used to replace the hostname placeholder in the base pipe path (Linux).
   *
   * @private
   * @static
   * @type {string}
   */
  private static HOSTNAME_DELIMITTER = "@hostname@";

  /**
   * Base path for named pipes on Windows.
   *
   * @private
   * @static
   * @type {string}
   */
  private static BASE_PIPE_PATH_WINDOWS =
    "\\\\.\\pipe\\" + this.USER_HOME_DELIMITER + "\\DevOpsCodeClearCase";

  /**
   * Base path for named pipes on Linux.
   *
   * @private
   * @static
   * @type {string}
   */
  private static BASE_PIPE_PATH_LINUX =
    this.USER_HOME_DELIMITER +
    "/.Rational/ide_integration/" +
    this.HOSTNAME_DELIMITTER +
    "/DevOpsCodeClearCase";

  /**
   * Response pipe names will have a randomly generated unique ID appended to them during runtime to ensure each request is handled separately.
   *
   * @private
   * @static
   * @type {string}
   */
  private static RESPONSE_PIPE_NAME = "IDE_Response_";

  /**
   * Creates the directory structure required for a Linux named pipe path if it does not already exist.
   *
   * @async
   * @param {string} pipePath The full path of the named pipe.
   * @description This function is designed for Linux systems and checks if the directory for the provided named
   * pipe path exists. If not, it creates the directory recursively
   */
  public static createLinuxNamedPipePath = async (
    pipePath: string
  ): Promise<void> => {
    if (!pipePath) {
      logger.error("Invalid pipe path provided for Linux directory creation.");
      return;
    }
    try {
      const dirPath = dirname(pipePath);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
    } catch (err) {
      logger.error(
        `An error occurred while creating namedpipe path for linux: ${err}`
      );
    }
  };

  /**
   * Constructs the full path for a listener pipe by combining the base pipe path
   * with the specified listener pipe name.
   *
   * @param {string} listenerPipeName - The name of the listener pipe
   * @returns {string} The full path to the listener pipe.
   */
  public static getListenerPipe = (listenerPipeName: string): string => {
    if (!listenerPipeName) {
      throw new Error("Listener pipe name is required.");
    }
    return join(this.getBasePipePath(), listenerPipeName);
  };

  /**
   * Constructs the full path for a response pipe by combining the base pipe path,
   * the response pipe name, an underscore, and the specified process ID (PID).
   *
   * @param {string} pid - The process ID to append to the response pipe path.
   * @returns {string} The full path to the response pipe.
   */
  public static getResponsePipe = (pid: string): string => {
    if (!pid) {
      throw new Error("Process ID is required to construct response pipe path.");
    }
    return join(this.getBasePipePath(), this.RESPONSE_PIPE_NAME + pid);
  };

  /**
   * Retrieves the base path for named pipes based on the current operating system.
   *
   * @returns {string} The formatted base pipe path specific to the OS and current user.
   */
  private static getBasePipePath = (): string => {
    const currentUser = os.userInfo().username;
    if (isWindowsOS()) {
      return this.BASE_PIPE_PATH_WINDOWS.replace(
        this.USER_HOME_DELIMITER,
        currentUser
      );
    } else {
      return this.BASE_PIPE_PATH_LINUX.replace(
        this.USER_HOME_DELIMITER,
        currentUser
      ).replace(this.HOSTNAME_DELIMITTER, os.hostname());
    }
  };

  /**
   * Checks whether a named pipe exists at the specified path.
   * Attempts to connect to the pipe, resolving to `true` if the connection is successful,
   * or `false` if an error occurs.
   *
   * @param {string} pipePath - The path of the named pipe to check.
   * @returns {Promise<boolean>} `true` if the pipe exists, or `false` otherwise.
   */
  public static isNamedPipeAvailable = (pipePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const client = net.connect(pipePath, () => {
        client.end();
        resolve(true);
      });
      client.on("error", () => {
        resolve(false);
      });
    });
  };

  /**
   * Writes data to a specified named pipe.
   * Establishes a connection to the named pipe, sends the data, and closes the connection
   *
   * @param {string} namedPipe - The path of the named pipe to which the data will be written.
   * @param {string} data - The data to write to the named pipe.
   */
  public static writeDataToNamedPipe = async (
    namedPipe: string,
    data: string
  ): Promise<void> => {
    const client = net.createConnection(namedPipe, () => {
      logger.debug(`Writing data to named pipe ${namedPipe}`);
      client.write(data + "\n");
      client.end();
    });

    client.on("error", (err) => {
      logger.error(
        `An error occurred while writing data to named pipe ${namedPipe}:`,
        err
      );
    });
  };

  /**
   * This method constructs the response pipe path using the given process ID
   * and writes the provided data to the pipe. It uses the underlying named pipe utility
   * to handle the data transmission.
   *
   * @async
   * @param {string} pid - The process ID for which the response pipe is targeted.
   * @param {string} data - The data to be written to the response pipe.
   * @returns {*} Resolves when the data is written to the pipe.
   */
  public static writeDataToResponsePipe = async (
    pid: string,
    data: string
  ): Promise<void> => {
    const responsePipe = this.getResponsePipe(pid);
    await this.writeDataToNamedPipe(responsePipe, data);
  };
}