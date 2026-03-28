import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

function parseCorsOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return ['http://localhost:3000'];
  }
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = parseCorsOrigins(configService.get<string>('CORS_ORIGINS'));

  const config = new DocumentBuilder().setTitle('Cats example').setDescription('The cats API description').setVersion('1.0').addTag('cats').build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, documentFactory, {jsonDocumentUrl: 'swagger/json'});

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(4200);
}
bootstrap();
