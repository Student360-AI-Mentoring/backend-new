import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// Config
import appConfig from './config/app.config';
import databaseConfig from './database/config/database-config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { StudentIdsModule } from './modules/student-ids/student-ids.module';
import { AuthModule } from './modules/auth/auth.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => new DataSource(options).initialize(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    AuthModule,
    StudentIdsModule,
  ],
  providers: [
    TypeOrmConfigService,
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
