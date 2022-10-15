import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { DatabaseModule } from 'src/database/database.module';
import { permissionProviders } from './permission.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, ...permissionProviders],
})
export class PermissionsModule {}
