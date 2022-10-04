import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  about: string;
  @IsString()
  avatar: string;
}
