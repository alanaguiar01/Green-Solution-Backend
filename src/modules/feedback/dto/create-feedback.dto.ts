import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @ApiProperty()
  type: string;

  @IsString()
  @ApiProperty()
  comment: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsBase64()
  @IsOptional()
  @ApiPropertyOptional()
  screenshot: string;
}
