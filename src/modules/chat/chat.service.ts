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

  generateRoomName(sender: User, receiver: User): string {
    if (sender.name.localeCompare(receiver.name) === -1) {
      return receiver.name;
    } else if (sender.name.localeCompare(receiver.name) === 1) {
      return sender.name;
    } else {
      throw new HttpException('even', HttpStatus.FORBIDDEN);
    }
  }

  checkPrivateRoomExists(sender: any, receiver: any): Promise<Room> {
    return this.roomRepository.findOne({
      where: { name: this.generateRoomName(sender, receiver) },
    });
  }

  async createRoom(sender: any, receiver: any): Promise<Room> {
    try {
      const Sender = await this.userService.findOneById(sender);
      const Receiver = await this.userService.findOneById(receiver);
      const newRoom = this.roomRepository.create({
        name: this.generateRoomName(Sender, Receiver),
        members: [Sender, Receiver],
      });
      return await this.roomRepository.save(newRoom);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN);
    }
  }

  async createMessage(
    sender: any,
    receiver: any,
    msg: string,
  ): Promise<Message> {
    try {
      const Sender = await this.userService.findOneById(sender);
      const Receiver = await this.userService.findOneById(receiver);
      let room = await this.checkPrivateRoomExists(Sender, Receiver);
      if (!room) {
        room = await this.createRoom(Sender, Receiver);
      }
      const message = this.messageRepository.create({
        text: msg,
        room: room,
        sender: Sender,
      });
      return await this.messageRepository.save(message);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.FORBIDDEN);
    }
  }

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
