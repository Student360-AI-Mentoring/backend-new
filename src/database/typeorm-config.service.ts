import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

import { AllConfigType } from '@/config/all-config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get('app.nodeEnv', { infer: true }) ?? 'development';

    const sslEnabled = this.configService.get('database.sslEnabled', {
      infer: true,
    });

    const sslConfig = sslEnabled
      ? {
          rejectUnauthorized:
            this.configService.get('database.rejectUnauthorized', {
              infer: true,
            }) ?? true,
          ca: this.configService.get('database.ca', { infer: true }) || undefined,
          key: this.configService.get('database.key', { infer: true }) || undefined,
          cert: this.configService.get('database.cert', { infer: true }) || undefined,
        }
      : undefined;

    const config = {
      type:
        (this.configService.get('database.type', {
          infer: true,
        }) as TypeOrmModuleOptions['type']) ?? 'postgres',
      url: this.configService.get('database.url', { infer: true }) || undefined,
      host: this.configService.get('database.host', { infer: true }) || undefined,
      port: this.configService.get('database.port', { infer: true }) || undefined,
      username: this.configService.get('database.username', { infer: true }) || undefined,
      password: this.configService.get<string>('database.password', { infer: true }) || undefined,
      database: this.configService.get('database.name', { infer: true }) || undefined,
      synchronize: this.configService.get('database.synchronize', { infer: true }) ?? false,
      dropSchema: false,
      keepConnectionAlive: true,
      logging: nodeEnv === 'development',
      autoLoadEntities: true,
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      migrationsTableName: 'migrations',
      extra: {
        max: this.configService.get('database.maxConnections', { infer: true }) ?? 100,
        ssl: sslConfig,
      },
    };

    return config as TypeOrmModuleOptions;
  }
}
