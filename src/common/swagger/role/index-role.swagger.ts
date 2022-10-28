import { OmitType } from '@nestjs/swagger';
import { Role } from '~/modules/roles/entities/role.entity';

export class IndexRoleSwagger extends OmitType(Role, []) {}
