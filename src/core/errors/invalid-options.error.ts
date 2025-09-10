export class InvalidOptionsError extends Error {
  readonly name = 'InvalidOptionsError';

  constructor() {
    super('invalid options');
  }
}
