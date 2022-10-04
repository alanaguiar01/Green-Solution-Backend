import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  @IsNotEmpty()
  zipCode: number;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
