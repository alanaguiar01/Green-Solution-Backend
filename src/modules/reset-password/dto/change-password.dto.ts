import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  // @IsNotEmpty()
  // @IsString()
  // userPassword: string;
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  newPassword: string;
}
