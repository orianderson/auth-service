import { Module } from '@nestjs/common';

import { AuthService } from '../presentation/services/auth.service';
import { RegisterUserUseCase, VerifyEmailUseCase } from '../app/usecases';
import { EmailService } from '@infra/services';

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
  IUserRepository,
} from '../core';

import { AuthController } from '../presentation';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    EmailTemplate,
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
    { provide: 'IBcryptService', useClass: BcryptService },
    { provide: 'IEmailValidatorService', useClass: EmailValidatorService },
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'PrismaService', useClass: PrismaService },
    BcryptService,
    EmailValidatorService,
    UserRepository,
  ],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
