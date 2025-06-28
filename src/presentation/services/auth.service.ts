import { Injectable } from '@nestjs/common';

import { RegisterUserUseCase } from '../../app';
import { RegisterUserInput } from '../../core';
import { BadRequestException } from '../exceptions';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async register(user: RegisterUserInput) {
    const newUser = await this.registerUserUseCase.execute(user);
    if (newUser.isLeft()) {
      console.log('first');
      throw new BadRequestException(newUser.value.message);
    }

    return newUser.value;
  }
}
