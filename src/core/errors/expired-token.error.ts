export class ExpiredTokenError extends Error {
  readonly name = 'ExpiredTokenError';

  constructor() {
    super('The token has expired. Please request a new one.');
  }
}
