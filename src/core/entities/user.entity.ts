import { IBcryptService, IEmailValidatorService } from '../services';

export interface UserProps {
  id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private user: UserProps;
  emailValidatorService: IEmailValidatorService;
  bcryptService: IBcryptService;

  private constructor(
    user: UserProps,
    emailValidatorService: IEmailValidatorService,
    bcryptService: IBcryptService,
  ) {
    this.emailValidatorService = emailValidatorService;
    this.bcryptService = bcryptService;
    this.user = {
      ...user,
      id: user.id || crypto.randomUUID(),
      email: this.validateEmail(user.email),
      password: user.password, // Will be set after hashing
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };
  }

  static async create(
    data: UserProps,
    emailValidatorService: IEmailValidatorService,
    bcryptService: IBcryptService,
  ): Promise<User> {
    const newUser = new User(data, emailValidatorService, bcryptService);
    newUser.user.password = await newUser.validatePassword(data.password);
    return newUser;
  }

  private validateEmail(email: string): string {
    if (!this.emailValidatorService.isEmailValid(email)) {
      throw new Error('E-mail inválido');
    }

    return email;
  }

  private async validatePassword(password: string): Promise<string> {
    const STRONG_PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      throw new Error(
        'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&)',
      );
    }

    return await this.bcryptService.hash(password);
  }

  public async updatePassword(newPassword: string): Promise<void> {
    this.user.password = await this.validatePassword(newPassword);
    this.user.updatedAt = new Date();
  }

  public validateCredentials(password: string): boolean {
    return this.user.password === password;
  }
}
