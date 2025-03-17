/**
 * Represents the response from an API.
 */
export class APIResponse {
  private responseCode: number;
  private responseMsg: string;

  /**
   * Creates an instance of APIResponse.
   * @param responseCode - The response code from the API.
   * @param responseMsg - The response message from the API.
   */
  public constructor(responseCode: number, responseMsg: string) {
    this.responseCode = responseCode;
    this.responseMsg = responseMsg;
  }

  /**
   * Retrieves the response code.
   * @returns The response code as a number.
   */
  public getResponseCode(): number {
    return this.responseCode;
  }

  /**
   * Retrieves the response message.
   * @returns The response message as a string.
   */
  public getResponseMsg(): string {
    return this.responseMsg;
  }
}
