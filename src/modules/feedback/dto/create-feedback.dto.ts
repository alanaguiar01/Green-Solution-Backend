import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @ApiProperty()
  type: string;

  @IsString()
  @ApiProperty()
  comment: string;

  @IsString({ message: 'erro base64 não é string' })
  // @IsBase64({ message: 'erro base64' })
  @IsOptional({ message: 'erro base64 não opcional' })
  @ApiPropertyOptional()
  screenshot: string;
}
