import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends BaseModelEntity {
  @Column({ nullable: true })
  name: string;
}
