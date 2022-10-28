import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  new_password: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  confirm_password: string;
}
