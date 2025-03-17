import * as os from 'os';
import * as path from 'path';

/**
 * Application-wide constants used in the ElectronJS part.
 */
export const AppConstants = {
  /**
   * Directory path for storing IDE integration configuration.
   */
  IDE_INTEGRATION_CONFIG_DIR: path.join(os.homedir(), ".Rational", "ide_integration", os.hostname()),

  /**
   * File name for IDE integration configuration.
   */
  IDE_INTEGRATION_CONFIG_FILE: ".config",

  /**
   * Application log directory name
   */
  APP_LOG_DIRECTORY_NAME: "logs",

  /*
  * Application log file name
  */
  APP_LOG_FILE_NAME: "ideintegration-ui.log",

  /**
   * Key for the idle timeout setting.
   */
  IDLE_TIMEOUT: "idle_timeout",

  /**
   * Default idle timeout value in minutes.
   */
  DEFAULT_IDLE_TIMEOUT_IN_MINUTES: 15,

  /**
   * IPC communication handler names.
   */
  IPC_HANDLERS: {
    /**
     * Handler for finishing an action.
     */
    FINISH: "finish:action",

    /**
     * Handler for cancelling an action.
     */
    CANCEL: "cancel:action",

    /**
     * Handler for retrieving the current window ID.
     */
    GET_WINDOW_ID: "get:windowid",

    /**
     * Handler for browsing a directory path.
     */
    BROWSE_DIRECTORY_PATH: "browse:directory:path",

    /**
     * Handler for retrieving the user's home directory.
     */
    GET_USER_HOME_DIR: "get:user:home:dir",

    /**
     * Handler for sending an operation name from ElectronJS to  ReactJS.
     */
    OPERATION_NAME: "send:operationname",
  },
} as const;
