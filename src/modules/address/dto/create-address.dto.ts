import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  zipCode: number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  street: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  state: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  country: string;
}
