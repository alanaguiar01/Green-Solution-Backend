import { PartialType } from '@nestjs/mapped-types';
import { CreateResetPasswordDto } from './create-reset-password.dto';

export class UpdateResetPasswordDto extends PartialType(CreateResetPasswordDto) {}
