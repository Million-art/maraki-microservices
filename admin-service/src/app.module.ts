import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as Joi from 'joi';
import { HealthController } from './infrastructure/monitoring/health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { APP_FILTER } from '@nestjs/core';
import { SharedModule } from './shared/shared.module';
import { AllExceptionsFilter } from './shared/exceptions/all.exception';
import { LoggerService } from './shared/logs/logger.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // No await needed here as we're just returning the config object
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true, // automatically load entities
          synchronize: configService.get<string>('NODE_ENV') === 'development', // ❌ never use in prod
          logging: configService.get<string>('NODE_ENV') === 'development',
        };
      },
    }),

    // Health check
    TerminusModule,
    SharedModule,
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
          queue: 'admin_queue',
        },
      },
    ]),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    LoggerService,
  ],
  controllers: [HealthController],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      if (this.dataSource.isInitialized) {
        console.log('PostgreSQL Connected ✅');
      } else {
        console.log('PostgreSQL Not Connected ❌');
      }
    } catch (err: any) {
      console.error(
        'PostgreSQL Connection Error ❌',
        err?.message || 'Unknown error',
      );
    }
    // No await needed here as we're just logging
  }
}
