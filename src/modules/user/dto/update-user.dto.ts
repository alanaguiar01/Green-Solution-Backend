import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '~/modules/auth/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
