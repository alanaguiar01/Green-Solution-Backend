import 'reflect-metadata';
import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from '../seeds/main.seed';
import { join } from 'path';

export const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: '192.168.0.6',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../../modules/*/entities') + '/*'],
  migrations: [join(__dirname, '../migrations/*.{.ts, .js')],
  seeds: [MainSeeder],
  factories: ['src/database/factories/*{.ts,.js}'],
  logging: false,
  synchronize: false,
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return options;
  },
};
