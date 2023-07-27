import { OmitType } from '@nestjs/swagger';
import { User } from '~/modules/user/entities/user.entity';

export class CreateAccessControlListUserSwagger extends OmitType(User, [
  'createdAt',
  'email',
  'profile',
  'name',
  'hashPassword',
  'rooms',
]) {}
