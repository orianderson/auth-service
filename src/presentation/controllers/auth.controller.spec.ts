import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, CreateUserResponseDto } from '../dtos';
import { StatusResponse } from '../../app/constants/status-response';
import {
  BadRequestException,
  ConflictException,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should_register_user_with_valid_data', async () => {
    const dto: CreateUserDto = new CreateUserDto({
      email: 'test@example.com',
      password: 'Password123!',
    });
    const response: CreateUserResponseDto = new CreateUserResponseDto({
      id: 'user-id-1',
      email: 'test@example.com',
      createdAt: new Date(),
    });
    authService.register.mockResolvedValue(response);

    const result = await controller.registerUser(dto);

    expect(result).toEqual(response);
  });

  it('should_return_response_in_create_user_response_dto_format', async () => {
    const dto: CreateUserDto = new CreateUserDto({
      email: 'user@domain.com',
      password: 'StrongPassw0rd!',
      name: 'Test User',
      acceptedTerms: true,
      acceptedPrivacyPolicy: true,
    });
    const response = {
      id: 'abc123',
      email: 'user@domain.com',
      name: 'Test User',
      createdAt: new Date(),
      extraField: 'should not be here',
    };
    authService.register.mockResolvedValue(response);

    const result = await controller.registerUser(dto);

    expect(result).toMatchObject({
      id: response.id,
      email: response.email,
      createdAt: response.createdAt,
    });
  });

  it('should_return_400_for_invalid_email_format', async () => {
    const dto = new CreateUserDto({
      email: 'invalid-email',
      password: 'Password123!',
    });

    // Validate using class-validator to simulate NestJS validation pipe
    const errors = await validate(plainToInstance(CreateUserDto, dto));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should_return_409_for_duplicate_email_registration', async () => {
    const dto: CreateUserDto = new CreateUserDto({
      email: 'duplicate@example.com',
      password: 'Password123!',
    });
    authService.register.mockRejectedValue(
      new ConflictException('Email already exists'),
    );

    await expect(controller.registerUser(dto)).rejects.toThrow(
      ConflictException,
    );
    await expect(controller.registerUser(dto)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should_return_400_for_unexpected_service_error', async () => {
    const dto: CreateUserDto = new CreateUserDto({
      email: 'user@domain.com',
      password: 'Password123!',
    });
    authService.register.mockRejectedValue(
      new BadRequestException('An unexpected error occurred'),
    );

    await expect(controller.registerUser(dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(controller.registerUser(dto)).rejects.toThrow(
      'An unexpected error occurred',
    );
  });
});
