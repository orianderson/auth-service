import {
  IRegisterUserUseCase,
  RegisterUserOutput,
  IBcryptService,
  IEmailValidatorService,
  IUserRepository,
  Either,
  left,
  right,
  InvalidTermsPolicyError,
  UserProps,
} from '../../core';
import {
  InvalidEmailError,
  InvalidPasswordError,
  InvalidDataError,
  ConflictError,
} from '../../core';

import { UserDomainService } from '../../core';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly bcrypt: IBcryptService,
    private readonly emailValidator: IEmailValidatorService,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Registers a new user.
   * @param input UserProps - The user registration data.
   * @returns Either an error or the registered user output.
   */
  async execute(
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
  > {
    // Check if user already exists
    if (await this.userRepository.findByEmail(input.email)) {
      return left(new ConflictError());
    }

    // Attempt to create a new user domain entity
    const newUser = await UserDomainService.createUser(
      input,
      this.emailValidator,
      this.bcrypt,
    );

    if (newUser.isLeft()) {
      const error = newUser.value;
      if (error instanceof InvalidEmailError)
        return left(new InvalidEmailError(input.email));
      if (error instanceof InvalidPasswordError)
        return left(new InvalidPasswordError());
      if (error instanceof InvalidTermsPolicyError)
        return left(new InvalidTermsPolicyError());
      return left(new InvalidDataError());
    }

    const userEntity = newUser.value;

    // Persist the new user
    const createdUSer = await this.userRepository.create({
      id: userEntity.id,
      email: userEntity.email,
      name: userEntity.name,
      password: userEntity.getPasswordForPersistence(),
      createdAt: userEntity.createdAt,
      acceptedTerms: userEntity.acceptedTerms,
      acceptedPrivacyPolicy: userEntity.acceptedPrivacyPolicy,
      systemId: input.systemId,
      roleId: userEntity.roleId,
    });

    // Return the registration output
    return right({
      ...userEntity.toJSON(),
      emailVerificationToken: createdUSer.emailVerificationToken,
    });
  }
}
