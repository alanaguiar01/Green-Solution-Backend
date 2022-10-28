import { BaseEntityModel } from '~/modules/../common/baseModel';
import { Post } from '~/modules/post/entities/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
@Entity({ name: 'photos' })
export class Photo extends BaseEntityModel {
  @Column({ nullable: true })
  @ApiProperty()
  url: string;

  @ManyToOne(() => Post, (post) => post.photos)
  @ApiPropertyOptional()
  post: Post[];
}
