import { HandleException, IError } from './handler-exceptions';
import { StatusResponse } from '../constants';

export class BadRequestException extends HandleException {
  constructor(message: IError) {
    super(StatusResponse.BAD_REQUEST.statusCode, message);
  }
}
