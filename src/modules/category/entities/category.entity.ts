import { BaseEntityModel } from '~/modules/../common/baseModel';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'categories' })
export class Category extends BaseEntityModel {
  @Column({ nullable: true })
  @ApiProperty()
  name: string;
}
