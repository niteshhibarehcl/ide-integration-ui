import { Mutex } from "async-mutex";
import logger from "../../logger/logger";
import { RequestProcessor } from "./request-processor";
import { AppIdleTimeoutHandler } from "../utils/app-timeout-handler";

/**
 * A singleton class for managing and processing incoming requests in a sequential manner.
 * Utilizes a queue to handle requests and ensures thread-safe operations with a mutex.
 *
 * @export
 * @class RequestQueueManager
 * @typedef {RequestQueueHandler}
 */
export class RequestQueueHandler {
  private static instance: RequestQueueHandler;
  private static mutex = new Mutex();

  /**
   * The queue that holds incoming requests to be processed sequentially.
   */
  private requestQueue: Buffer[] = [];

  /**
   * Flag indicating whether the queue is currently being processed.
   */
  private isQueueProcessing = false;

  private constructor() {}

  public static async getInstance(): Promise<RequestQueueHandler> {
    if (!RequestQueueHandler.instance) {
      await RequestQueueHandler.mutex.runExclusive(async () => {
        if (!RequestQueueHandler.instance) {
          RequestQueueHandler.instance = new RequestQueueHandler();
        }
      });
    }
    return RequestQueueHandler.instance;
  }

  /**
   * Adds a request to the processing queue. If the queue is not already being processed,
   * initiates processing.
   *
   * @public
   * @param {Buffer} request - The request to be added to the queue.
   */
  public async enqueueRequest(request: Buffer): Promise<void> {
    await RequestQueueHandler.mutex.runExclusive(async () => {
      this.requestQueue.push(request);
      if (!this.isQueueProcessing) {
        this.processRequestQueue();
      }
    });
  }

  /**
   * Processes the request queue sequentially. Each request is removed from the queue and handled.
   *
   * @private
   * @static
   * @async
   * @returns {Promise<void>} A promise that resolves when the queue processing is complete.
   */
  private async processRequestQueue(): Promise<void> {
    this.isQueueProcessing = true;
    logger.info('Starting queue processing');
    while (this.requestQueue.length > 0) {
      const requestChunk = this.requestQueue.shift();
      if (requestChunk) {
        try{
        await this.delegateRequestProcessing(requestChunk.toString());
      } catch (error) {
        logger.error(`Error processing request: ${(error as Error).message}`);
      }
    }
    this.isQueueProcessing = false;
    logger.info('Queue processing completed');
  }
}

  /**
   * Handles incoming data from the named pipe by delegating the request to the `ProcessRequest` class.
   * It creates an instance of `ProcessRequest` for each request and executes the request.
   *
   * @private
   * @static
   * @async
   * @param {string} request - The request received from the named pipe.
   * @returns {Promise<void>}
   */
  private async delegateRequestProcessing(request: string): Promise<void> {
    // Reset app timeout as activity is detected
    AppIdleTimeoutHandler.resetTimeout();
    if (request) {
      logger.info(`Request received by the UI listener pipe: ${request}`);
      const requestProcessor = new RequestProcessor();
      requestProcessor.processRequest(request);
    }
  }
}
