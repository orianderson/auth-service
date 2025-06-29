import { Injectable } from '@nestjs/common';

import { RegisterUserUseCase } from '../../app';
import { ConflictError, InvalidTermsPolicyError, UserProps } from '../../core';
import { BadRequestException, ConflictException } from '../exceptions';
import { CreateUserResponseDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  /**
   * Registers a new user and handles domain errors by mapping them to HTTP exceptions.
   * @param user User properties for registration.
   * @returns The created user response DTO.
   * @throws BadRequestException | ConflictException
   */
  async register(user: UserProps): Promise<CreateUserResponseDto> {
    const newUser = await this.registerUserUseCase.execute(user);

    if (!newUser.isLeft()) {
      return newUser.value;
    }

    const { value: error } = newUser;

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof ConflictError) {
      throw new ConflictException(error.message);
    }
    if (error instanceof InvalidTermsPolicyError) {
      throw new BadRequestException(
        'You must accept the terms and privacy policy',
      );
    }

    throw new BadRequestException('An unexpected error occurred');
  }
}
