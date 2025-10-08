import { Module } from '@nestjs/common';
import { MiniAppController } from './controllers/mini-app.controller';
import { RootController } from './controllers/root.controller';
import { AppService } from '../app.service';

@Module({
  controllers: [MiniAppController, RootController],
  providers: [AppService],
})
export class PresentationModule {}
