import { Module } from '@nestjs/common';
import { databaseProviders } from './config/typeorm.config';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
