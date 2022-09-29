import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  receiver: string;

  @IsUUID()
  room: string;
}
