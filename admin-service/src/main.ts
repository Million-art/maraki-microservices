import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
  
async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  // Connect microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: 'localhost', port: parseInt(process.env.MICROSERVICE_PORT || '8877') }
  });

   // Global prefix
  app.setGlobalPrefix('api'); 

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

 

  await app.startAllMicroservices();
  await app.listen(PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
 }
bootstrap();
