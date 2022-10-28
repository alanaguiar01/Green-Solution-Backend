import { Address } from '~/modules/address/entities/address.entity';
import { BaseEntityModel } from '~/modules/../common/baseModel';
import { Post } from '~/modules/post/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'profiles' })
export class Profile extends BaseEntityModel {
  @Column()
  @ApiProperty()
  about: string;

  @Column()
  @ApiProperty()
  avatar: string;

  @OneToMany(() => Post, (post) => post.profile)
  @ApiPropertyOptional()
  post: Post[];

  @OneToMany(() => Address, (address) => address.profile)
  @ApiPropertyOptional()
  address: Address[];
}
