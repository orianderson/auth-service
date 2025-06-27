import { IEmailValidatorService } from 'src/core';
import validator from 'validator';

export class EmailValidatorService implements IEmailValidatorService {
  isEmailValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
