import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StatusResponse } from '@app/constants';
import { UpdateCredentialsDto, VerifyEmailDto } from '../dtos';

import { UpdateService } from '../services/update.service';

@Controller('auth')
@ApiTags('update')
export class UpdateCredentialsController {
  constructor(private readonly updateService: UpdateService) {}
  @Post('verify-email')
  @HttpCode(StatusResponse.OK.statusCode)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<{
    message: string;
    statusCode: number;
    timestamp: string;
    email: string;
  }> {
    await this.updateService.verifyEmail(verifyEmailDto.email);

    return {
      message: 'Confirmation email sent',
      statusCode: StatusResponse.OK.statusCode,
      timestamp: new Date().toISOString(),
      email: verifyEmailDto.email,
    };
  }
}
