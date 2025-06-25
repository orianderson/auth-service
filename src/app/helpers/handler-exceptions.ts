export interface IError {
  message: string;
}

export class HandleException extends Error {
  statusCode: number;
  response: IError;
  constructor(statusCode: number, response: IError) {
    super();
    this.statusCode = statusCode;
    this.response = response;
  }

  getStatus() {
    return this.statusCode;
  }

  getResponse() {
    return this.response;
  }
}
