import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from './logs/logger.service';
import { MetricsService } from './metrics/metrics.service';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [JwtModule],
  providers: [LoggerService, MetricsService, JwtGuard],
  exports: [LoggerService, MetricsService, JwtGuard],
})
export class SharedModule {}
