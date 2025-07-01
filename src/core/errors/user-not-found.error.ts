export class UserNotFoundError extends Error {
  readonly name = 'UserNotFoundError';

  constructor() {
    super(`You will need to register before you can log in.`);
  }
}
