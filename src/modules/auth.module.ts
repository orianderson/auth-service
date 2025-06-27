import { Module } from '@nestjs/common';

import { AuthService } from '../presentation/services/user.service';
import { RegisterUserUseCase } from '../app/usecases';

import { BcryptService, EmailValidatorService, UserRepository } from '../infra';
import {
  IBcryptService,
  IEmailValidatorService,
  IUserRepository,
} from '../core';

import { AuthController } from '../presentation';

@Module({
  imports: [],
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
    { provide: 'IBcryptService', useClass: BcryptService },
    { provide: 'IEmailValidatorService', useClass: EmailValidatorService },
    { provide: 'IUserRepository', useClass: UserRepository },
    BcryptService,
    EmailValidatorService,
    UserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
