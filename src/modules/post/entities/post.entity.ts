import { BaseEntityModel } from '~/modules/../common/baseModel';
import { Category } from '~/modules/category/entities/category.entity';
import { Photo } from '~/modules/photos/entities/photo.entity';
import { Profile } from '~/modules/profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
@Entity({ name: 'posts' })
export class Post extends BaseEntityModel {
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  description: string;

  @ManyToOne(() => Profile, (profile) => profile.post)
  @ApiPropertyOptional()
  profile: Profile[];

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  @ApiPropertyOptional()
  categoty: Category;

  @OneToMany(() => Photo, (photo) => photo.post)
  @ApiPropertyOptional()
  photos: Photo[];
}
