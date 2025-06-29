import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.CONFLICT,
    error: string = 'Conflict Exception',
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
