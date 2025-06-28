import {
  InvalidDataError,
  InvalidEmailError,
  InvalidPasswordError,
} from '../errors';
import { Either } from '../helpers';

export interface IRegisterUserUseCase {
  execute(
    input: RegisterUserInput,
  ): Promise<
    Either<
      InvalidEmailError | InvalidPasswordError | InvalidDataError,
      RegisterUserOutput
    >
  >;
}

export type RegisterUserInput = {
  email: string;
  password: string;
};

export type RegisterUserOutput = {
  id?: string;
  email: string;
  createdAt?: Date;
};
