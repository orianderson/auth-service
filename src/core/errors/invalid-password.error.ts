export class InvalidPasswordError extends Error {
  readonly name = 'InvalidPasswordError';

  constructor() {
    super(
      'The password must contain: alphabetical character (lowercase, uppercase), at least 1 numeric character, at least one special character and must be eight characters or longer',
    );
  }
}
