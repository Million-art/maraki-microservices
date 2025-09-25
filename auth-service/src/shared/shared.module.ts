import { Module } from '@nestjs/common';
import { LoggerService } from './logs/logger.service';

@Module({
    providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}
