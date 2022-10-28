import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserACLRequest {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsArray()
  @ApiProperty()
  roles: string[];

  @IsArray()
  @ApiProperty()
  permissions: string[];
}
