import { HandleException, IError } from './handler-exceptions';
import { StatusResponse } from '../constants';

export class ConflictException extends HandleException {
  constructor(message: IError) {
    super(StatusResponse.CONFLICT.statusCode, message);
  }
}
