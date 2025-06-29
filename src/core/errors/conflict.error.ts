export class ConflictError extends Error {
  readonly name = 'ConflictError';

  constructor() {
    super('User already exists. Please use a different email address.');
  }
}
