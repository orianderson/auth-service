import { Module } from '@nestjs/common';

import { AuthService } from '../presentation/services/auth.service';
import { RegisterUserUseCase } from '../app/usecases';

import {
  BcryptService,
  EmailValidatorService,
  PrismaService,
  UserRepository,
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
  exports: [AuthService],
})
export class AuthModule {}
