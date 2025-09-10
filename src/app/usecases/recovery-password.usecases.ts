import {
  Either,
  left,
  right,
  IUserRepository,
  UserNotFoundError,
  IRecoveryPasswordUseCase,
} from '../../core';

export class RecoveryPasswordUseCase implements IRecoveryPasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Inicia o processo de recuperação de senha.
   * @param input Dados para recuperação de senha.
   * @returns Mensagem de sucesso ou erro.
   */
  async execute(
    email: string,
  ): Promise<Either<UserNotFoundError, { name: string; token?: string }>> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return left(new UserNotFoundError());
    }

    return right({ name: user.name, token: user.emailVerificationToken });
  }
}
