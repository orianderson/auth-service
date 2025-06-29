import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

import { CreateUserDto, CreateUserResponseDto } from '../dtos';
import { StatusResponse } from '../../app';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(StatusResponse.CREATED.statusCode)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const user = await this.authService.register(createUserDto);
    return user;
  }
}
