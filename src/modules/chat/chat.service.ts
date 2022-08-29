import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  initJoin(user: User, client) {
    const roomsToJoin = [];
    user.rooms.forEach((room) => {
      return roomsToJoin.push(room.name);
    });
    client.join(roomsToJoin);
  }

  generateRoomName(sender: User, receiver: User): string {
    if (sender.name.localeCompare(receiver.name) === -1) {
      return receiver.name;
    } else if (sender.name.localeCompare(receiver.name) === 1) {
      return sender.name;
    } else {
      throw new HttpException('even', HttpStatus.FORBIDDEN);
    }
  }

  async checkPrivateRoomExists(sender: User, receiver: User) {
    return await this.roomRepository.findOne({
      where: { name: this.generateRoomName(sender, receiver) },
    });
  }

  createPrivateRoom(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }
  createPublicRoom(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  // findAll() {
  //   return `This action returns all chat`;
  // }

  async findById(id: string): Promise<Room> {
    return await this.roomRepository.findOne({ where: { id } });
  }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
