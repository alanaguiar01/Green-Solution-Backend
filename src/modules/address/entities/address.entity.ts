import { BaseEntityModel } from '~/common/baseModel';
import { Profile } from '~/modules/profile/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'address' })
export class Address extends BaseEntityModel {
  @Column()
  zipCode: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @ManyToOne(() => Profile, (profile) => profile.address)
  profile: Profile[];
}
