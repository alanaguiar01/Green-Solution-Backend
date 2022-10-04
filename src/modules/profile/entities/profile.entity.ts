import { Address } from 'src/modules/address/entities/address.entity';
import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Profile extends BaseModelEntity {
  @Column()
  about: string;

  @Column()
  avatar: string;

  @OneToMany(() => Post, (post) => post.profile)
  post: Post[];

  @OneToMany(() => Address, (address) => address.profile)
  address: Address[];
}
