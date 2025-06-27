import { Injectable } from '@nestjs/common';

import { RegisterUserUseCase } from '../../app';
import { RegisterUserInput } from '../../core';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async register(user: RegisterUserInput) {
    return this.registerUserUseCase.execute(user);
  }
}
