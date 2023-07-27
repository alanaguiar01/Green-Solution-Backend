import { OmitType } from '@nestjs/swagger';
import { Role } from '~/modules/roles/entities/role.entity';

export class CreateRoleSwagger extends OmitType(Role, [
  'createdAt',
  'permissions',
  'updatedAt',
]) {}
