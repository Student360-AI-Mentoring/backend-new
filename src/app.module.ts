import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Common
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// Config
import appConfig from './config/app.config';
import databaseConfig from './database/config/database-config';
import throttlerConfig from './config/throttler.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { StudentIdsModule } from './modules/student-ids/student-ids.module';
import { AuthModule } from './modules/auth/auth.module';
import { AllConfigType } from './config/all-config.type';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => new DataSource(options).initialize(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, throttlerConfig],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const throttlerConf = configService.get('throttler', { infer: true });
        return [
          {
            ttl: (throttlerConf?.ttl ?? 60) * 1000, // Convert to milliseconds
            limit: throttlerConf?.limit ?? 10,
          },
        ];
      },
    }),
    infrastructureDatabaseModule,
    AuthModule,
    StudentIdsModule,
  ],
  providers: [
    TypeOrmConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
