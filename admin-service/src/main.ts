import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT;
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
    .setDescription('API documentation for the Admin Service')
    .setVersion('1.0')
    .addTag('admin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
