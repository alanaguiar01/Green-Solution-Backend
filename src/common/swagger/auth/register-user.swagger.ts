import { PickType } from '@nestjs/swagger';
import { User } from '~/modules/user/entities/user.entity';

export class CreateUserSwagger extends PickType(User, [
  'name',
  'email',
  'profile',
]) {}
