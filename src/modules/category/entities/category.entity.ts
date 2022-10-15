import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseModelEntity {
  @Column({ nullable: true })
  name: string;
}
