import { Either } from '../helpers';
import { UserNotFoundError } from '@core/errors';

export interface IRecoveryPasswordUseCase {
  execute(
    email: string,
  ): Promise<Either<UserNotFoundError, { message: string }>>;
}
