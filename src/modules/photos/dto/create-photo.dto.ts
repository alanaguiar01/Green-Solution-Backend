import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePhotoDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}
