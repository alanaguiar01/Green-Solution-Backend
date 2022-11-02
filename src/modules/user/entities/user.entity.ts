import { Room } from '~/modules/chat/entities/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  BeforeInsert,
  JoinTable,
  OneToOne,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Permission } from '~/modules/permissions/entities/permission.entity';
import { Role } from '~/modules/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import { Profile } from '~/modules/profile/entities/profile.entity';
import { BaseEntityModel } from '~/common/baseModel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends BaseEntityModel {
  @Column({ length: 100 })
  @ApiProperty()
  name: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  @ApiProperty()
  password: string;

  @OneToOne(() => Profile)
  @ApiPropertyOptional()
  profile: Profile;

  @ManyToMany(() => Room, (room) => room.members)
  @ApiPropertyOptional()
  rooms: Room[];

  @ManyToMany(() => Role, { cascade: true, nullable: false })
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  @ApiPropertyOptional()
  roles: Role[];

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'users_permissions',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
  @ApiPropertyOptional()
  permissions: Permission[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  toJSON(): User {
    const obj = { ...this };
    delete obj.password;
    return obj;
  }
}
