import { BaseEntityModel } from '../../../common/baseModel';
import { Category } from '../../category/entities/category.entity';
import { Photo } from '../../photos/entities/photo.entity';
import { Profile } from '../../profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
@Entity({ name: 'posts' })
export class Post extends BaseEntityModel {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => Profile, (profile) => profile.post)
  profile: Profile[];

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  categoty: Category;

  @OneToMany(() => Photo, (photo) => photo.post)
  photos: Photo[];
}
