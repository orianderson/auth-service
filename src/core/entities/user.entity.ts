import { Either, left, right } from '../helpers';
import { InvalidPasswordError, InvalidEmailError } from '../errors';
import { IBcryptService, IEmailValidatorService } from '../services';

export interface UserProps {
  id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  user: UserProps;

  private constructor(user: UserProps) {
    this.user = {
      ...user,
      email: user.email,
      password: user.password,
    };
  }

  static async create(
    data: UserProps,
    emailValidatorService: IEmailValidatorService,
    bcryptService: IBcryptService,
  ): Promise<Either<Error, UserEntity>> {
    const newUser = new UserEntity(data);

    const validEmail = newUser.validateEmail(
      newUser.user.email,
      emailValidatorService,
    );

    if (validEmail.isLeft()) {
      return left(new InvalidEmailError(newUser.user.email));
    }

    const validPassword = await newUser.validatePassword(
      data.password,
      bcryptService,
    );

    if (validPassword.isLeft()) {
      return left(new InvalidPasswordError());
    }

    if (validPassword.isRight()) {
      newUser.user.password = validPassword.value;
    }
    newUser.user.id = crypto.randomUUID();
    newUser.user.createdAt = new Date();
    return right(newUser);
  }

  private validateEmail(
    email: string,
    emailValidator: IEmailValidatorService,
  ): Either<InvalidEmailError, string> {
    if (!emailValidator.isEmailValid(email)) {
      return left(new InvalidEmailError(email));
    }

    return right(email);
  }

  private async validatePassword(
    password: string,
    bcryptService: IBcryptService,
  ): Promise<Either<InvalidPasswordError, string>> {
    const STRONG_PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      return left(new InvalidPasswordError());
    }

    const hashPassword = await bcryptService.hash(password);
    return right(hashPassword);
  }

  static async updatePassword(
    user: UserProps,
    bcryptService: IBcryptService,
  ): Promise<Either<InvalidPasswordError, UserEntity>> {
    const userObj = new UserEntity({
      email: user.email,
      password: user.password,
    });
    const hashPassword = await userObj.validatePassword(
      user.password,
      bcryptService,
    );

    if (hashPassword.isLeft()) {
      return left(new InvalidPasswordError());
    }
    if (hashPassword.isRight()) {
      userObj.user.password = hashPassword.value;
      userObj.user.updatedAt = new Date();
    }

    return right(userObj);
  }

  public async validateCredentials(
    password: string,
    bcryptService: IBcryptService,
  ): Promise<boolean> {
    return await bcryptService.compare(password, this.user.password);
  }
}
