import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración detallada de CORS
  /*
  app.enableCors({
    origin: '*', // Permitir solo este dominio específico
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true, // Permitir envío de credenciales (cookies, headers de autenticación)
  });
  */

  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("Football Bets G23")
    .setDescription("The best football bets app")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}
bootstrap();
