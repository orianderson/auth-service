import { Injectable } from '@nestjs/common';

import { RegisterUserUseCase } from '../../app';
import { ConflictError, RegisterUserInput } from '../../core';
import { BadRequestException, ConflictException } from '../exceptions';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async register(user: RegisterUserInput) {
    const newUser = await this.registerUserUseCase.execute(user);
    if (newUser.isLeft()) {
      if (newUser.value instanceof BadRequestException) {
        throw new BadRequestException(newUser.value.message);
      } else if (newUser.value instanceof ConflictError) {
        throw new ConflictException(newUser.value.message);
      } else {
        throw new BadRequestException('An unexpected error occurred');
      }
    }

    return newUser.value;
  }
}
