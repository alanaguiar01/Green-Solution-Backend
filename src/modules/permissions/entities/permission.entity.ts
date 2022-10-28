import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntityModel } from '~/common/baseModel';

@Entity({ name: 'permissions' })
export class Permission extends BaseEntityModel {
  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiPropertyOptional()
  description: string;
}
