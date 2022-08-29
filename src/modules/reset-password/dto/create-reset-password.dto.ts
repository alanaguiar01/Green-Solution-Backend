import { IsEmail, IsString } from 'class-validator';

export class CreateResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}
