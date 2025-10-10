import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3002;

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Mini App Service API')
    .setDescription('API documentation for Mini App Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Root response middleware
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/' && req.method === 'GET') {
      return res.json({ message: 'Welcome to the Mini App Service API' });
    }
    next();
  });

  // Health check middleware
  app.use((req: Request, res: Response, next: any) => {
    if (req.path === '/health' && req.method === 'GET') {
      return res.json({ 
        status: 'ok', 
        service: 'mini-app-service',
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  await app.listen(PORT);
  console.log(`running on http://localhost:${PORT}`);
}
bootstrap();
