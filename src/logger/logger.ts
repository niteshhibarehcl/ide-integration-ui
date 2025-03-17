import { createLogger, format, transports, Logger } from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import { AppConstants } from '../electron/common/app-constants';

/**
 * Defines the logging levels for the application.
 *
 * @type {Record<string, number>}
 */
const levels: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

/**
 * Gets the log file path.
 *
 * @returns {string} The log file path.
 */
const getLogFilePath = (): string => {
  const logFolder = path.join(AppConstants.IDE_INTEGRATION_CONFIG_DIR, AppConstants.APP_LOG_DIRECTORY_NAME);

  // Ensure the directory exists
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
  }

  return path.join(logFolder, AppConstants.APP_LOG_FILE_NAME);
};

/**
 * Load the configuration from the config.json file.
 *
 * @returns {Record<string, any>} The configuration object.
 */
const loadConfig = (): Record<string, any> => {
  const configPath = path.resolve(__dirname, '../config.json');
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } else {
      console.warn(`Config file not found at ${configPath}. Using default settings.`);
      return {};
    }
  } catch (error) {
    console.error(`Failed to load configuration: ${error}`);
    return {};
  }
};

// Load configuration
const config = loadConfig();

// Get the log level from configuration or default to 'info'
const logLevel = config.logLevel || 'info';

// Define log file path
const logFilePath = getLogFilePath();

// Create and export the logger instance
const logger: Logger = createLogger({
  levels,
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
    new transports.File({ filename: logFilePath }),
  ],
});

export default logger;