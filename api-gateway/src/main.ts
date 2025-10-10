import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { getAggregatedSwagger } from './swagger-aggregator';
 
async function bootstrap() {
 
  const PORT = process.env.PORT ?? 3003;
  const app = await NestFactory.create(AppModule);
  const FRONTEND_URL = process.env.FRONTEND_URL
  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: [`${FRONTEND_URL}`],
    credentials: true
  })
  // Swagger setup
  const httpService = app.get(HttpService);
  const configService = app.get(ConfigService);
  const document = await getAggregatedSwagger(httpService, configService);
  SwaggerModule.setup('docs', app, document);

  // Global prefix
  app.setGlobalPrefix('api', { exclude: ['/', '/health', '/test', '/docs'] });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Versioning (URI) - temporarily disabled for testing
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1', // default version if not specified
  // });

  await app.listen(PORT);
  console.log(` API Gateway running on http://localhost:${PORT}`);
}
bootstrap();
