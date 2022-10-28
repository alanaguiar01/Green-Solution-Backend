import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @ApiProperty()
  about: string;

  @ApiProperty()
  @IsString()
  avatar: string;
}
