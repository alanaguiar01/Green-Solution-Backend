import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
export class Photo extends BaseModelEntity {
  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Post, (post) => post.photos)
  post: Post[];
}
