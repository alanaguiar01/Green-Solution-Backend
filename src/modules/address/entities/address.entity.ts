import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Address extends BaseModelEntity {
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
