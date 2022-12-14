import { BaseEntityModel } from '~/modules/../common/baseModel';
import { User } from '~/modules/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity({ name: 'rooms' })
export class Room extends BaseEntityModel {
  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => User, (user) => user.rooms, { cascade: true })
  @JoinTable({
    name: 'users_rooms',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'room_id' }],
  })
  members: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
