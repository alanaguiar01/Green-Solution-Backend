import { Address } from '~/modules/address/entities/address.entity';
import { BaseEntityModel } from '~/common/baseModel';
import { Post } from '~/modules/post/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile extends BaseEntityModel {
  @Column()
  about: string;

  @Column()
  avatar: string;

  @OneToMany(() => Post, (post) => post.profile)
  post: Post[];

  @OneToMany(() => Address, (address) => address.profile)
  address: Address[];
}
