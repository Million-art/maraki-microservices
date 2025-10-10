import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice({
    transport: Transport.NATS,
    options: { servers: ['nats://localhost:4222'], queue: 'admin_queue' },
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Admin Service API')
    .setDescription('API documentation for the Admin Service - User and Quiz Management')
    .setVersion('1.0')
    .addTag('admin', 'Admin operations for users and quizzes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Root response middleware
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/' && req.method === 'GET') {
      return res.json({ message: 'Welcome to the Admin Service API' });
    }
    next();
  });

  // Health check middleware
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/health' && req.method === 'GET') {
      return res.json({ 
        status: 'ok', 
        service: 'admin-service',
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  await app.startAllMicroservices();
  await app.listen(PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
