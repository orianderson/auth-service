import {
  IRegisterUserUseCase,
  RegisterUserInput,
  RegisterUserOutput,
  IBcryptService,
  IEmailValidatorService,
  IUserRepository,
  UserEntity,
} from '../../core';
import { ConflictException } from '../helpers/conflict-exceptions';
import { InvalidEmailError, InvalidPasswordError } from '../../core';
import { BadRequestException } from '../helpers';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly bcrypt: IBcryptService,
    private readonly emailValidator: IEmailValidatorService,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const isUser = await this.userRepository.findByEmail(input.email);
    if (isUser) {
      throw new ConflictException({
        message: 'User already exists',
      });
    }

    const newUser = await UserEntity.create(
      input,
      this.emailValidator,
      this.bcrypt,
    );

    if (newUser.isLeft()) {
      if (newUser.value instanceof InvalidEmailError) {
        throw new BadRequestException({ message: 'Invalid email format' });
      }
      if (newUser.value instanceof InvalidPasswordError) {
        throw new BadRequestException({
          message:
            'The password must contain: alphabetical character (lowercase, uppercase), at least 1 numeric character, at least one special character and must be eight characters or longer',
        });
      }
      // If newUser isLeft but not an InvalidEmailError or InvalidPasswordError, throw a generic error
      throw new BadRequestException({ message: 'Invalid user data' });
    }

    await this.userRepository.create({
      id: newUser.value.user.id,
      email: newUser.value.user.email,
      password: newUser.value.user.password,
      createdAt: newUser.value.user.createdAt,
    });

    return {
      id: newUser.value.user.id,
      email: newUser.value.user.email,
      createdAt: newUser.value.user.createdAt,
    };
  }
}
