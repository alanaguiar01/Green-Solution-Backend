import 'dotenv/config';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: '192.168.0.6',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // entities: [__dirname + '/../../**/*.entity/*{.js, .ts}'],
  entities: ['src/**/*.entity{.ts,.js}'],
  //migrations: [__dirname + '/../migrations/*{.ts, .js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  // logging: true,
  // synchronize: false,
});