import { BaseEntityModel } from '~/common/baseModel';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntityModel {
  @Column({ nullable: true })
  name: string;
}
