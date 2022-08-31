import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
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
    private readonly userService: UserService,
  ) {}

  initJoin(user: User, client) {
    const roomsToJoin = [];
    user.rooms.forEach((room) => {
      return roomsToJoin.push(room.name);
    });
    client.join(roomsToJoin);
  }

  generateRoomName(sender, receiver): string {
    if (sender.name.localeCompare(receiver.name) === -1) {
      return receiver.name;
    } else if (sender.name.localeCompare(receiver.name) === 1) {
      return sender.name;
    } else {
      throw new HttpException('even', HttpStatus.FORBIDDEN);
    }
  }

  checkPrivateRoomExists(sender, receiver): Promise<Room> {
    return this.roomRepository.findOne({
      where: { name: this.generateRoomName(sender, receiver) },
    });
  }

  async createChat(sender: string, receiver: string): Promise<Room> {
    try {
      const Sender = await this.userService.findOneById(sender);
      const Receiver = await this.userService.findOneById(receiver);
      const room = await this.checkPrivateRoomExists(Sender, Receiver);
      if (!room) {
        const newRoom = this.roomRepository.create({
          name: this.generateRoomName(Sender, Receiver),
          members: [Sender, Receiver],
        });
        return await this.roomRepository.save(newRoom);
      } else {
        return room;
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN);
    }
  }

  // async createMessage(
  //   sender: User,
  //   receiver: User,
  //   msg: string,
  // ): Promise<Message> {
  //   let room = await this.checkPrivateRoomExists(sender, receiver);
  //   if (!room) {
  //     room = await this.createChat(sender, receiver);
  //   }
  //   return this.messageRepository.save({
  //     text: msg,
  //     sender: sender,
  //     room: room,
  //   });
  // }

  // createPrivateRoom(createChatDto: CreateChatDto) {
  //   return 'This action adds a new chat';
  // }
  // createPublicRoom(createChatDto: CreateChatDto) {
  //   return 'This action adds a new chat';
  // }

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
