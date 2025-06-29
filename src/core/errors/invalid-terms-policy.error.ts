export class InvalidTermsPolicyError extends Error {
  readonly name = 'InvalidTermsPolicyError';

  constructor() {
    super('You must accept the terms and privacy policy.');
  }
}
