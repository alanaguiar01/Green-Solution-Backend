import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePhotoDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
