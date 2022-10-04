import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Photo } from 'src/modules/photos/entities/photo.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
@Entity()
export class Post extends BaseModelEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => Profile, (profile) => profile.post)
  profile: Profile[];

  @OneToOne(() => Category)
  @JoinColumn()
  categoty: Category;

  @OneToMany(() => Photo, (photo) => photo.post)
  photos: Photo[];
}
