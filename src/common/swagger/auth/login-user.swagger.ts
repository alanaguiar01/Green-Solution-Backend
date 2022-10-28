import { PickType } from '@nestjs/swagger';
import { User } from '~/modules/user/entities/user.entity';

export class LoginUserSwagger extends PickType(User, [
  'email',
  'id',
  'profile',
]) {}
