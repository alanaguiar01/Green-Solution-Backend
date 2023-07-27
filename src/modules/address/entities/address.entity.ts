import { BaseEntityModel } from '~/modules/../common/baseModel';
import { Profile } from '~/modules/profile/entities/profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'address' })
export class Address extends BaseEntityModel {
  @Column()
  @ApiProperty()
  zipCode: number;

  @Column()
  @ApiProperty()
  street: string;

  @Column()
  @ApiProperty()
  city: string;

  @Column()
  @ApiProperty()
  state: string;

  @Column()
  @ApiProperty()
  country: string;

  @ManyToOne(() => Profile, (profile) => profile.address)
  @ApiPropertyOptional()
  profile: Profile[];
}
