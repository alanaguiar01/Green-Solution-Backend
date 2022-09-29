import { Room } from 'src/modules/chat/entities/room.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  BeforeInsert,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @ManyToMany(() => Room, (room) => room.members)
  rooms: Room[];

  @ManyToMany(() => Role)
  roles: Role[];

  @ManyToMany(() => Permission)
  permissions: Permission[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  toJSON() {
    const obj = { ...this };
    delete obj.password;
    return obj;
  }
}
