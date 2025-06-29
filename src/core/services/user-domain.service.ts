import { Either, left, right } from '../helpers';
import {
  InvalidPasswordError,
  InvalidEmailError,
  InvalidTermsPolicyError,
} from '../errors';
import { IBcryptService, IEmailValidatorService } from '../services';
import { UserEntity } from '../entities/user.entity';
import { CreateUserProps } from '../entities/user-props';

export class UserDomainService {
  static async createUser(
    data: CreateUserProps,
    emailValidator: IEmailValidatorService,
    bcryptService: IBcryptService,
  ): Promise<Either<Error, UserEntity>> {
    if (!data.acceptedTerms || !data.acceptedPrivacyPolicy) {
      return left(new InvalidTermsPolicyError());
    }

    if (!emailValidator.isEmailValid(data.email)) {
      return left(new InvalidEmailError(data.email));
    }

    const STRONG_PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!STRONG_PASSWORD_REGEX.test(data.password)) {
      return left(new InvalidPasswordError());
    }

    const hashedPassword = await bcryptService.hash(data.password);

    const user = new UserEntity({
      ...data,
      id: crypto.randomUUID(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: undefined,
    });

    return right(user);
  }
}
