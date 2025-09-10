import { Module } from '@nestjs/common';

import { AuthService, UpdateService } from '../presentation/services';
import {
  RegisterUserUseCase,
  VerifyEmailUseCase,
  RecoveryPasswordUseCase,
} from '../app/usecases';
import { EmailService, JwtService } from '@infra/services';

import {
  BcryptService,
  EmailValidatorService,
  PrismaService,
  UserRepository,
  EmailTemplate,
} from '../infra';
import {
  IBcryptService,
  IEmailValidatorService,
  IJwtService,
  IUserRepository,
} from '../core';

import { AuthController, UpdateCredentialsController } from '../presentation';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController, UpdateCredentialsController],
  providers: [
    AuthService,
    EmailService,
    EmailTemplate,
    UpdateService,
    {
      provide: RegisterUserUseCase,
      useFactory: (
        bcrypt: IBcryptService,
        emailValidator: IEmailValidatorService,
        userRepository: IUserRepository,
      ) => new RegisterUserUseCase(bcrypt, emailValidator, userRepository),
      inject: ['IBcryptService', 'IEmailValidatorService', 'IUserRepository'],
    },
    {
      provide: VerifyEmailUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new VerifyEmailUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    {
      provide: UserRepository,
      useFactory: (databaseService: PrismaService) => {
        new UserRepository(databaseService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: RecoveryPasswordUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new RecoveryPasswordUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    { provide: 'IBcryptService', useClass: BcryptService },
    { provide: 'IEmailValidatorService', useClass: EmailValidatorService },
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'PrismaService', useClass: PrismaService },
    { provide: 'IJwtService', useClass: JwtService },
    BcryptService,
    EmailValidatorService,
    UserRepository,
  ],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
