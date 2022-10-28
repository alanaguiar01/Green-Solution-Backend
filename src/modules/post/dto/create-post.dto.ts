import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
