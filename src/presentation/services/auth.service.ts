import { Injectable } from '@nestjs/common';

import { RegisterUserUseCase, VerifyEmailUseCase } from '../../app';
import {
  ConflictError,
  InvalidTermsPolicyError,
  InvalidTokenError,
  UserProps,
} from '../../core';
import { BadRequestException, ConflictException } from '../exceptions';
import { CreateUserResponseDto } from '../dtos';

import { EmailService, EmailTemplate } from '@infra/services';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly emailService: EmailService,
    private readonly emailTemplate: EmailTemplate,
    private readonly verifyEmailUsecases: VerifyEmailUseCase,
  ) {}

  /**
   * Registers a new user and handles domain errors by mapping them to HTTP exceptions.
   * @param user User properties for registration.
   * @returns The created user response DTO.
   * @throws BadRequestException | ConflictException
   */
  async register(user: UserProps): Promise<CreateUserResponseDto> {
    const newUser = await this.registerUserUseCase.execute(user);

    if (!newUser.isLeft()) {
      await this.emailService.sendEmail({
        to: newUser.value.email,
        subject: 'Welcome to Our Service',
        html: this.emailTemplate.confirmEmailTemplate(
          newUser.value.name,
          newUser.value.emailVerificationToken,
        ),
      });

      const { emailVerificationToken, ...rest } = newUser.value;
      return rest;
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

  async confirmUserEmail(id: string, token: string): Promise<boolean> {
    const result = await this.verifyEmailUsecases.execute(id, token);

    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof InvalidTokenError) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw new BadRequestException('An unexpected error occurred');
    }

    return result.value;
  }
}
