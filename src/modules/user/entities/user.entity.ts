import { Room } from 'src/modules/chat/entities/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  BeforeInsert,
  JoinTable,
  OneToOne,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { BaseModelEntity } from 'src/common/BaseModel.entity';
import { Exclude } from 'class-transformer';
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Entity({ name: 'users' })
export class User extends BaseModelEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @OneToOne(() => Profile)
  profile: Profile;

  @ManyToMany(() => Room, (room) => room.members)
  rooms: Room[];

  @ManyToMany(() => Role, { cascade: true, nullable: false })
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  roles: Role[];

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'users_permissions',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
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
