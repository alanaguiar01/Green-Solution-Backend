import { OmitType } from '@nestjs/swagger';
import { Role } from '~/modules/roles/entities/role.entity';

export class CreateRolePermissionSwagger extends OmitType(Role, [
  'createdAt',
  'permissions',
  'updatedAt',
]) {}
