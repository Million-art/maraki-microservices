import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TerminusModule } from '@nestjs/terminus';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { SharedModule } from './shared/shared.module';
import { AllExceptionsFilter } from './shared/exceptions/all.exception';
import { LoggerService } from './shared/logs/logger.service';
import { ProxyModule } from './modules/proxy.module';
import { ControllersModule } from './controllers/controllers.module';
import { RootModule } from './controllers/root.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        ADMIN_SERVICE_URL: Joi.string().default('http://localhost:3000'),
        AUTH_SERVICE_URL: Joi.string().default('http://localhost:3001'),
        MINI_APP_SERVICE_URL: Joi.string().default('http://localhost:3002'),
      }),
    }),

    // Health check
    TerminusModule,

    // Throttling
    ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 30 }]),

    // Caching
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: 'redis',
        port: 6379,
      }),
    }),
    SharedModule,
    ProxyModule,
    ControllersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'}
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    LoggerService,
  ],
  controllers: [],
})
export class AppModule {}
