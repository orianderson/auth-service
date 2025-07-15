import { Either } from '../helpers';
import { InvalidTokenError } from '../errors';

export interface IVerifyEmailUseCase {
  execute(
    id: string,
    token: string,
  ): Promise<Either<InvalidTokenError, boolean>>;
}
