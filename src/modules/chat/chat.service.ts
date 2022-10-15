import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { WsException } from '@nestjs/websockets';
@Injectable()
export class ChatService {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: Repository<Message>,
    @Inject('ROOM_REPOSITORY')
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
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
    const Sender = await this.userService.findOneById(sender);
    const Receiver = await this.userService.findOneById(receiver);
    if (!Receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }
    const newRoom = this.roomRepository.create({
      name: this.generateRoomName(Sender, Receiver),
      members: [Sender, Receiver],
    });
    return this.roomRepository.save(newRoom);
  }

  async createMessage(
    sender: any,
    receiver: any,
    msg: string,
  ): Promise<Message> {
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
    return this.messageRepository.save(message);
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
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
