import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://192.168.16.127:8081', // Replace with your frontend origin
    //origin: 'http://localhost:8081', // Replace with your frontend origin

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(5000, '0.0.0.0');
}

bootstrap();
