import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateResetPasswordDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
