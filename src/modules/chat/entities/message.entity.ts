import { BaseEntityModel } from '~/modules/../common/baseModel';
import { User } from '~/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity({ name: 'messages' })
export class Message extends BaseEntityModel {
  @Column({ nullable: true })
  text: string;

  @ManyToOne(() => User, (user) => user)
  sender: User;

  @ManyToOne(() => Room, (room) => room)
  room: Room;
}
