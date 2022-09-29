import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({})
  description: string;

  @ManyToMany(() => User)
  users: User[];

  @ManyToMany(() => Role)
  roles: Role[];
}
