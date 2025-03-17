/**
 * A class representing a communication channel with a response pipe and an associated token.
 *
 * @export
 * @class Communication
 * @typedef {Communication}
 */
export class Communication {
  private responsePipe: string;
  private token: string;

  constructor(responsePipe: string, token: string) {
    this.responsePipe = responsePipe;
    this.token = token;
  }

  /**
   * Retrieves the response pipe.
   *
   * @public
   * @returns {string} The response pipe used for communication.
   */
  public getResponsePipe(): string {
    return this.responsePipe;
  }

  /**
   * Retrieves the token.
   *
   * @public
   * @returns {string} The token associated with the communication.
   */
  public getToken(): string {
    return this.token;
  }
}
