import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('API completa para gerenciamento de filmes com autenticação JWT')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Endpoints de autenticação e registro')
    .addTag('Movies', 'CRUD completo de filmes com filtros e paginação')
    .addTag('Upload', 'Upload de imagens para AWS S3')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(5000, '0.0.0.0');
  console.log('🚀 Application is running on: http://0.0.0.0:5000');
  console.log('📚 Swagger documentation: http://0.0.0.0:5000/api/docs');
}
bootstrap();
