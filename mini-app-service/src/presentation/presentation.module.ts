import { Module } from '@nestjs/common';
import { MiniAppController } from './controllers/mini-app.controller';
import { QuizController } from './controllers/quize.microservice.controller';
import { AppService } from '../app.service';
import { LoggerService } from '../shared/logs/logger.service';

@Module({
  controllers: [MiniAppController, QuizController],
  providers: [AppService, LoggerService],
})
export class PresentationModule {}
