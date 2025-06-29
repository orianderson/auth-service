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
      | ConflictError,
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
      return left(new InvalidDataError());
    }

    await this.userRepository.create({
      id: newUser.value.user.id,
      email: newUser.value.user.email,
      password: newUser.value.user.password,
      createdAt: newUser.value.user.createdAt,
    });

    return right({
      id: newUser.value.user.id,
      email: newUser.value.user.email,
      createdAt: newUser.value.user.createdAt,
    });
  }
}
