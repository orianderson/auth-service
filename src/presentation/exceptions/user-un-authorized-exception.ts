import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUnAuthorizedException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
    error: string = 'User Unauthorized Exception',
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
