import { IVerifyEmailUseCase } from '@core/usecases';
import { IUserRepository } from '@core/repositories';

import { Either, left, right } from '@core/helpers';
import { InvalidTokenError } from '@core/errors';

export class VerifyEmailUseCase implements IVerifyEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    id: string,
    token: string,
  ): Promise<Either<InvalidTokenError, boolean>> {
    const user = await this.userRepository.confirmEmail(id);

    if (
      !user ||
      user.emailVerificationTokenExpiresAt < new Date() ||
      user.emailVerificationToken !== token
    ) {
      return left(new InvalidTokenError());
    }

    await this.userRepository.update(
      {
        id: id,
        emailVerified: true,
      },
      'Email verified successfully',
    );

    return right(true);
  }
}
