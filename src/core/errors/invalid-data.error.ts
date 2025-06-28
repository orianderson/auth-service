export class InvalidDataError extends Error {
  readonly name = 'InvalidDataError';

  constructor() {
    super(
      'The provided data is invalid. Please check the input and try again.',
    );
  }
}
