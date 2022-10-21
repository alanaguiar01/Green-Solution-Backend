import 'reflect-metadata';
import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from '../seeds/main.seed';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../../../**/*.entity/*{.js, .ts}'],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      logging: true,
      synchronize: false,
    };
  },
};

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: '192.168.0.6',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  seeds: [MainSeeder],
  factories: ['src/database/factories/*{.ts,.js}'],
  logging: true,
  synchronize: false,
};
export const dataSource = new DataSource(options);
