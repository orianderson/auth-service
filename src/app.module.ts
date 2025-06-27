import { Module } from '@nestjs/common';

import { AuthModule } from './modules';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
