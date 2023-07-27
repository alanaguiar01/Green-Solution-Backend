import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  receiver: string;

  @IsString()
  sender: string;
}
