import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RolePermissionsRequest {
  // @IsString()
  // @IsNotEmpty()
  // @IsUUID()
  roleId: string;
  @IsArray()
  @ApiProperty()
  permissions: string[];
}
