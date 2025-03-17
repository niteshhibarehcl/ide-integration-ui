import * as path from "path";
import PropertiesReader from "properties-reader";
import { Mutex } from "async-mutex";
import { AppConstants } from "../common/app-constants";
import * as fs from "fs";
import logger from "../../logger/logger";

/**
 * A utility class for loading and accessing properties from a configuration file.
 * Uses a cache to store properties and ensures thread-safe access to the cache.
 *
 * @export
 * @class PropertyLoadReader
 * @typedef {PropertyLoadReader}
 */
export class PropertyLoadReader {
  /**
   * A cache to store configuration properties for quick access.
   */
  private static propertyCache: Map<string, string> = new Map<string, string>();

  private static instance: PropertyLoadReader;
  /**
   * A mutex to ensure thread-safe updates to the configuration properties.
   */
  private static mutex = new Mutex();

  private watchInitialized: boolean = false;

  private constructor() {}

  /**
   * Retrieves the singleton instance of the `PropertyLoadReader` class.
   *
   * @public
   * @static
   * @async
   * @returns {Promise<PropertyLoadReader>} A promise that resolves to the singleton instance of the `PropertyLoadReader` class.
   */
  public static async getInstance(): Promise<PropertyLoadReader> {
    if (!PropertyLoadReader.instance) {
      await PropertyLoadReader.mutex.runExclusive(async () => {
        if (!PropertyLoadReader.instance) {
          PropertyLoadReader.instance = new PropertyLoadReader();
        }
      });
    }
    return PropertyLoadReader.instance;
  }

  /**
   * Loads the configuration properties from a property file.
   * This method reads the configuration file located in the user's home directory,
   * parses the properties, and stores them in the `propertyCache`.
   *
   * @async
   * @returns {*} A promise that resolves when the properties are loaded.
   */
  public loadConfigPropertyFile = async (): Promise<void> => {
    await PropertyLoadReader.mutex.runExclusive(async () => {
      try {
        if (!fs.existsSync(AppConstants.IDE_INTEGRATION_CONFIG_DIR)) {
          fs.mkdirSync(AppConstants.IDE_INTEGRATION_CONFIG_DIR, {
            recursive: true,
          });
        }
        const configFilePath = path.join(
          AppConstants.IDE_INTEGRATION_CONFIG_DIR,
          AppConstants.IDE_INTEGRATION_CONFIG_FILE
        );
        const propertyReader = PropertiesReader(configFilePath);
        const properties = propertyReader.getAllProperties();
        // Clear the cache before updating to ensure no stale data.
        PropertyLoadReader.propertyCache.clear();
        for (const [key, value] of Object.entries(properties)) {
          PropertyLoadReader.propertyCache.set(key, value.toString());
        }
        //monitor config file changes
        if (!this.watchInitialized) {
          await this.watchConfigFile(configFilePath);
          this.watchInitialized = true;
        }
      } catch (error) {
        throw new Error(
          `Failed to load configuration file: Error: ${
            (error as Error).message
          }`
        );
      }
    });
  };

  /**
   * Retrieves the value of a specific property from the cache.
   *
   * @async
   * @param {string} key - The key of the property to retrieve.
   * @returns {Promise<string | undefined>} A promise that resolves to the property value,
   * or `undefined` if the key does not exist in the cache.
   */
  public static getProperty = async (
    key: string
  ): Promise<string | undefined> => {
    return PropertyLoadReader.propertyCache.get(key);
  };

  /**
   * Watches the configuration file for changes and reloads the properties when a change is detected.
   *
   * @async
   * @param {string} file - The path to the configuration file to watch.
   * @returns {*} 
   */
  private watchConfigFile = async (file: string):Promise<void> => {
    fs.watch(file, async (eventType) => {
      if (eventType === "change") {
        logger.info(`Properties file changed. Reloading...`);
        await this.loadConfigPropertyFile();
      }
    });
  };
}
