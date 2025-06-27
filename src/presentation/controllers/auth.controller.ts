import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/user.service';
import { FastifyReply } from 'fastify';

import { CreateUserDto, CreateUserResponseDto } from '../dtos';
import { StatusResponse } from '../../app';

// TODO - Improvement Exceptions Filter

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const user = await this.authService.register(createUserDto);

      return reply.code(StatusResponse.CREATED.statusCode).send(user);
    } catch (error) {
      return reply
        .status(StatusResponse.INTERNAL_SERVER_ERROR.statusCode)
        .send({
          statusCode: StatusResponse.INTERNAL_SERVER_ERROR.statusCode,
          message: 'Internal server error',
        });
    }
  }
}
