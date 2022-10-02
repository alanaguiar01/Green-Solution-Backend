import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserACLRequest {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @IsArray()
  roles: string[];
  @IsArray()
  permissions: string[];
}
