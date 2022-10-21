import { BaseEntityModel } from '../../../common/baseModel';
import { Post } from '../../post/entities/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity({ name: 'photos' })
export class Photo extends BaseEntityModel {
  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Post, (post) => post.photos)
  post: Post[];
}
