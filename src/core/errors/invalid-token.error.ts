export class InvalidTokenError extends Error {
  readonly name = 'InvalidTokenError';

  constructor() {
    super(`The provided token is invalid or has expired.`);
  }
}
