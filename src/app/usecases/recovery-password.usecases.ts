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
  ): Promise<Either<UserNotFoundError, { message: string }>> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return left(new UserNotFoundError());
    }

    // Gera token de recuperação
    // const token = await this.recoveryTokenService.generate(user.id);

    // Envia e-mail com instruções de recuperação
    // await this.emailService.sendRecoveryEmail(user.email, token);

    return right({ message: 'Recovery e-mail send succession' });
  }
}
