import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsString()
  @IsNotEmpty()
  new_password: string;
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
