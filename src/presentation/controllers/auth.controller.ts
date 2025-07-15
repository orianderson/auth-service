import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

import { CreateUserDto, CreateUserResponseDto, ConfirmEmailDto } from '../dtos';
import { StatusResponse } from '../../app';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user registration.
   * @param createUserDto - Data for creating a new user.
   * @returns The created user's response DTO.
   */
  @Post('register')
  @HttpCode(StatusResponse.CREATED.statusCode)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.authService.register({
      ...createUserDto,
      id: '',
      createdAt: new Date(),
    });
  }

  @Post('verify-email')
  @HttpCode(StatusResponse.OK.statusCode)
  async confirmUserEmail(
    @Body() confirmEmailDto: ConfirmEmailDto,
  ): Promise<{ message: string; statusCode: number; timestamp: string }> {
    const result = await this.authService.confirmUserEmail(
      confirmEmailDto.id,
      confirmEmailDto.token,
    );
    if (result === false) {
      return {
        message: 'Invalid token or email already verified',
        statusCode: StatusResponse.BAD_REQUEST.statusCode,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      message: 'Email verified successfully',
      statusCode: StatusResponse.OK.statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}
