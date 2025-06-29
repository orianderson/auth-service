import {
  InvalidDataError,
  InvalidEmailError,
  InvalidPasswordError,
  ConflictError,
  InvalidTermsPolicyError,
} from '../errors';
import { Either } from '../helpers';

export interface IRegisterUserUseCase {
  execute(
    input: RegisterUserInput,
  ): Promise<
    Either<
      | InvalidEmailError
      | InvalidPasswordError
      | InvalidDataError
      | ConflictError
      | InvalidTermsPolicyError,
      RegisterUserOutput
    >
  >;
}

export type RegisterUserInput = {
  id?: string;
  email: string;
  password: string;
  name: string;
  acceptedTerms?: boolean;
  acceptedPrivacyPolicy?: boolean;
  systemId: string;
};

export type RegisterUserOutput = {
  id?: string;
  email: string;
  name: string;
  createdAt?: Date;
  systemId?: string;
};
