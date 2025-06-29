import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

import { CreateUserDto, CreateUserResponseDto } from '../dtos';
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
}
