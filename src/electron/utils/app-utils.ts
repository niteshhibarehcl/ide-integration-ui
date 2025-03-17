import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";
import crypto from "crypto";
import os from "os";
import { APIResponse } from "../models/APIResponse";

/**
 * Validates whether a given value exists in a provided object.
 *
 * @param {object} values - The object to check values against..
 * @param {string} value - The value to validate.
 * @returns {boolean} `true` if the value exists in the values, `false` otherwise.
 */
export const isValidValue = (values: object, value: string): boolean => {
  return Object.values(values).includes(value);
};

/**
 * Generates a random hexadecimal string of 16 characters.
 *
 * @returns {string} A randomly generated 16-character hexadecimal string.
 */
export const generateRandomName = (): string => {
  return crypto.randomBytes(8).toString("hex"); // Generates a 16-character hexadecimal string
};

/**
 * Checks if the current operating system is Windows.
 *
 * @returns {boolean} `true` if the OS is Windows, `false` otherwise.
 */
export const isWindowsOS = (): boolean => os.platform() === "win32";

/**
 * Parses a JSON string into an instance of a specified class.
 *
 * @template T - The type of the class instance to be returned.
 * @param {string} data - The JSON string to parse.
 * @param {ClassConstructor<T>} classType - The class constructor to transform the parsed object into an instance of.
 * @returns {T} An instance of the specified class containing the parsed data.
 */
export const transformJsonToInstance = <T>(
  data: string,
  classType: ClassConstructor<T>
): T => {
  if (!data) {
    throw new Error("Input JSON string 'data' cannot be null or undefined.");
  }
  if (!classType) {
    throw new Error("Input 'classType' cannot be null or undefined.");
  }
  return plainToInstance(classType, JSON.parse(data));
};

/**
 * Converts a class instance into a JSON string.
 *
 * @template T - The type of the class instance.
 * @param {T} instance - The class instance to be converted.
 * @returns {string} A JSON string representation of the instance.
 */
export const transformInstanceToJson = <T>(instance: T): string => {
  if (!instance) {
    throw new Error("Input 'instance' cannot be null or undefined.");
  }
  return JSON.stringify(instanceToPlain(instance));
};

/**
 * Builds an API response object as a JSON string.
 *
 * @param {number} responseCode - The response code to include in the API response.
 * @param {string} responseMsg - The response message to include in the API response.
 * @returns {string} A JSON string representation of the API response object.
 */
export const buildApiResponse = (responseCode: number, responseMsg:string):string => {
  return JSON.stringify(new APIResponse(responseCode, responseMsg));
}


/**
 * Sleep for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>}
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};