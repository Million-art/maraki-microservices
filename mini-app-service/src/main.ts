import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  //  Create a normal HTTP app first
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ?? 3002;

  //  Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Mini App Service API')
    .setDescription('API documentation for Mini App Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //  Root and health check routes
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/' && req.method === 'GET') {
      return res.json({ message: 'Welcome to the Mini App Service API' });
    }
    if (req.path === '/health' && req.method === 'GET') {
      return res.json({
        status: 'ok',
        service: 'mini-app-service',
        timestamp: new Date().toISOString(),
      });
    }
    next();
  });

  //  Connect microservice listener for NATS JetStream
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
      queue: 'quiz_events',
      durableName: 'quiz_subscriber', // persistent subscription
      deliver: 'all', // replay all missed messages on reconnect
    },
  });

  //  Start both HTTP and microservice layers
  await app.startAllMicroservices();
  await app.listen(PORT);

  console.log(` Mini App Service running on http://localhost:${PORT}`);
  console.log(` Swagger docs available at http://localhost:${PORT}/docs`);
}
bootstrap();
