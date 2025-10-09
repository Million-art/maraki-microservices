import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './health.controller';
import { MiniAppController } from './mini-app.controller';
import { PrometheusController } from './prometheus.controller';
import { SwaggerController } from './swagger.controller';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from '../shared/shared.module';
import { AdminController } from './admin.controller';
import { AuthController } from './auth.controller';

@Module({
  imports: [TerminusModule, JwtModule, HttpModule, SharedModule],
  controllers: [
    HealthController,
    AdminController,
    AuthController,
    MiniAppController,
    PrometheusController,
    SwaggerController,
  ],
})
export class ControllersModule {}
