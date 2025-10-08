import { Module } from '@nestjs/common';
import { LoggerService } from './logs/logger.service';
import { MetricsService } from './metrics/metrics.service';
import { JwtGuard } from './guards/jwt.guard';

@Module({
    providers: [LoggerService, MetricsService,JwtGuard],
  exports: [LoggerService, MetricsService,JwtGuard],
})
export class SharedModule {}
