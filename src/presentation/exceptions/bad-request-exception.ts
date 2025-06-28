import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    error: string = 'Bad Request',
    public readonly details?: any,
  ) {
    super(
      {
        message,
        error,
        statusCode: status,
        timestamp: new Date().toISOString(),
        ...(details ? { details: details as Record<string, any> } : {}),
      },
      status,
    );
  }
}
