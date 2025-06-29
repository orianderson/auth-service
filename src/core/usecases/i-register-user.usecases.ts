import {
  InvalidDataError,
  InvalidEmailError,
  InvalidPasswordError,
  ConflictError,
  InvalidTermsPolicyError,
} from '../errors';
import { Either } from '../helpers';
import { UserProps } from '../entities';

export interface IRegisterUserUseCase {
  execute(
    input: UserProps,
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

export type RegisterUserOutput = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  systemId: string;
};
