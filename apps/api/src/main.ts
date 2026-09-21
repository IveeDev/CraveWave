import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // NEW

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS
  app.setGlobalPrefix('api/v1'); // Set global prefix for all routes - api/v1/....
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // NEW: Swagger docs
  const config = new DocumentBuilder()
    .setTitle('CraveWave API')
    .setDescription('REST API for the CraveWave food delivery platform')
    .setVersion('1.0')
    .addBearerAuth() // remove this line if you don't use JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`🔥 API Gateway is running on port ${port}`);
  console.log(`📄 API docs available at /docs`); // NEW
}
bootstrap();
