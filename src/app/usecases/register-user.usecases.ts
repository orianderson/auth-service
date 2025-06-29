import {
  IRegisterUserUseCase,
  RegisterUserInput,
  RegisterUserOutput,
  IBcryptService,
  IEmailValidatorService,
  IUserRepository,
  UserEntity,
  Either,
  left,
  right,
  InvalidTermsPolicyError,
} from '../../core';
import {
  InvalidEmailError,
  InvalidPasswordError,
  InvalidDataError,
  ConflictError,
} from '../../core';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly bcrypt: IBcryptService,
    private readonly emailValidator: IEmailValidatorService,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
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
  > {
    const isUser = await this.userRepository.findByEmail(input.email);

    if (isUser) {
      return left(new ConflictError());
    }

    const newUser = await UserEntity.create(
      input,
      this.emailValidator,
      this.bcrypt,
    );

    if (newUser.isLeft()) {
      if (newUser.value instanceof InvalidEmailError) {
        return left(new InvalidEmailError(input.email));
      }
      if (newUser.value instanceof InvalidPasswordError) {
        return left(new InvalidPasswordError());
      }
      if (newUser.value instanceof InvalidTermsPolicyError) {
        return left(new InvalidTermsPolicyError());
      }
      return left(new InvalidDataError());
    }

    await this.userRepository.create({
      id: newUser.value.user.id,
      email: newUser.value.user.email,
      name: newUser.value.user.name,
      password: newUser.value.user.password,
      createdAt: newUser.value.user.createdAt,
      acceptedTerms: newUser.value.user.acceptedTerms,
      acceptedPrivacyPolicy: newUser.value.user.acceptedPrivacyPolicy,
      systemId: input.systemId,
    });

    return right({
      id: newUser.value.user.id,
      email: newUser.value.user.email,
      name: newUser.value.user.name,
      createdAt: newUser.value.user.createdAt,
      systemId: input.systemId,
    });
  }
}
