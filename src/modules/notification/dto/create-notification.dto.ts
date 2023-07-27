import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sender: string;
}
