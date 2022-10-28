import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiPropertyOptional()
  description: string;
}
