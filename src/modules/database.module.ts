import { Module } from '@nestjs/common';
import { PrismaService } from '../infra';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
