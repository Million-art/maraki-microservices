import { Module } from '@nestjs/common';
import { MiniAppController } from './controllers/mini-app.controller';
import { AppService } from '../app.service';

@Module({
  controllers: [MiniAppController],
  providers: [AppService],
})
export class PresentationModule {}
