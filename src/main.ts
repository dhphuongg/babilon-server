import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { AppModule } from './app.module';
import { EnvironmentConfig } from './infrastructure/config/environment.config';
import { TransformInterceptor } from './infrastructure/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './infrastructure/common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use(rateLimit({ windowMs: 1000, limit: 50 }));

  // static files
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/images',
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Apply global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );

  // Apply global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Document
  const documentConfig = new DocumentBuilder()
    .setTitle('Babilon')
    .setDescription('Babilon API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig, {});
  SwaggerModule.setup('/api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // Save the document to a local file
  const outputPath = path.resolve(process.cwd(), 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 4), {
    encoding: 'utf8',
  });

  const configService =
    app.get<ConfigService<EnvironmentConfig>>(ConfigService);
  const port = configService.get<number>('port', 3000);
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Application API Document: ${await app.getUrl()}/api-docs`);
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
