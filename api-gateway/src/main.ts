import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Request, Response } from 'express';
 
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
  const config = new DocumentBuilder()
    .setTitle('Maraki API Gateway')
    .setDescription('')
    .setVersion('1.0')
    .addTag('mini-app', 'Mini-app endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Global prefix
  app.setGlobalPrefix('api', { exclude: ['/', '/docs'] });

  // Root response middleware
  app.use((req:Request, res:Response, next:any) => {
    if (req.path === '/' && req.method === 'GET') {
      return res.send('Welcome to API Gateway');
    }
    next();
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Versioning (URI)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // default version if not specified
  });

  await app.listen(PORT);
  console.log(` API Gateway running on http://localhost:${PORT}`);
}
bootstrap();
