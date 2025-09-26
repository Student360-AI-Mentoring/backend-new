import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { requestIdMiddleware } from './common/middlewares/request-id.middleware';
import { AppConfig } from './config/app-config.type';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    if (!appConfig) {
      throw new Error('App configuration is not available');
    }

    const logger = new Logger(appConfig.name || 'Bootstrap');

    // Request correlation
    app.use(requestIdMiddleware);

    // Security
    app.use(helmet());
    app.use(compression());

    // CORS
    const corsOrigin = configService.get<string>('CORS_ORIGIN') || appConfig.frontendDomain || 'http://localhost:3000';

    const corsCredentialsEnv = configService.get<string>('CORS_CREDENTIALS');
    const corsCredentials = corsCredentialsEnv !== undefined ? corsCredentialsEnv.toLowerCase() === 'true' : true;

    app.enableCors({
      origin: corsOrigin,
      credentials: corsCredentials,
    });

    // Global prefix
    app.setGlobalPrefix(appConfig.apiPrefix);

    // Global pipes
    app.useGlobalPipes(new CustomValidationPipe());

    // Global filters
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger configuration
    const swaggerEnabledEnv = configService.get<string>('SWAGGER_ENABLED');
    const swaggerEnabled = swaggerEnabledEnv === 'true' || appConfig.nodeEnv !== 'production';

    if (swaggerEnabled) {
      const config = new DocumentBuilder()
        .setTitle(configService.get<string>('SWAGGER_TITLE') || 'API')
        .setDescription(configService.get<string>('SWAGGER_DESCRIPTION') || 'API Documentation')
        .setVersion(configService.get<string>('SWAGGER_VERSION') || '1.0.0')
        .addTag(configService.get<string>('SWAGGER_TAG') || 'api-tag')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
    }

    const port = appConfig.port;
    await app.listen(port);

    logger.log(`Application running on: http://localhost:${port}/${appConfig.apiPrefix}`);

    if (swaggerEnabled) {
      logger.log(`Swagger documentation: http://localhost:${port}/docs`);
    }

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.log(`Received ${signal}, shutting down gracefully`);
      await app.close();
      process.exit(0);
    };

    process.on('SIGTERM', () => {
      void gracefulShutdown('SIGTERM');
    });
    process.on('SIGINT', () => {
      void gracefulShutdown('SIGINT');
    });
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

void bootstrap();
