export class InvalidSignatureError extends Error {
  readonly name = 'InvalidSignatureError';

  constructor() {
    super(
      'The provided signature is invalid. Please check the input and try again.',
    );
  }
}
