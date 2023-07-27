import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * It takes a user object and a socket.io client object as parameters, loops through the user's
   * rooms, and pushes each room's name to an array. Then it joins the client to each room in the array
   * @param {User} user - User - This is the user object that was returned from the database.
   * @param client - The socket.io client object
   */
  initJoin(user: User, client) {
    const roomsToJoin = user.rooms.map((room) => room.name);
    client.join(roomsToJoin);
  }

  /**
   * It takes two users and returns a string that is the name of the room that they will be chatting in
   * @param {User} sender - User - The user who is sending the message
   * @param {User} receiver - The user who is receiving the message.
   * @returns A string
   */

  // private generateRoomName(sender: User, receiver: User) {
  //   if (sender.name.localeCompare(receiver.name) === 0) {
  //     throw new HttpException('Hata', HttpStatus.FORBIDDEN);
  //   }

  //   if (sender.name.localeCompare(receiver.name) === -1) {
  //     return sender.name + '-' + receiver.name;
  //   } else {
  //     return receiver.name + '-' + sender.name;
  //   }
  // }
  private generateRoomName(sender: User, receiver: User): string {
    // console.log(`test 1${sender.name}`, `test 2${receiver.name}`);
    if (sender.email.localeCompare(receiver.email) === -1) {
      // firstUsername is "<" (before) secondUsername
      return sender.email + '-' + receiver.email;
    } else if (sender.email.localeCompare(receiver.email) === 1) {
      // firstUsername is ">" (after) secondUsername
      return receiver.email + '-' + sender.email;
    } else {
      throw new HttpException('Invalid users', HttpStatus.BAD_REQUEST);
      // ids are equal, should throw an error
    }
  }
  /**
   * It checks if a private room exists between two users
   * @param {any} sender - The user who is sending the message
   * @param {any} receiver - The user that the sender wants to send a message to.
   * @returns A promise of a room
   */
  checkPrivateRoomExists(sender: User, receiver: User): Promise<Room> {
    return this.roomRepository.findOne({
      where: { name: this.generateRoomName(sender, receiver) },
    });
  }

  /**
   * It creates a new room with the sender and receiver as members
   * @param {any} sender - any, receiver: any
   * @param {any} receiver - any - The receiver of the message.
   * @returns The room that was created.
   */
  async createRoom(sender: User, receiver: User): Promise<Room> {
    const Sender = await this.userService.findOneById(sender.id);
    const Receiver = await this.userService.findOneById(receiver.id);
    if (!Receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }
    const newRoom = this.roomRepository.create({
      name: this.generateRoomName(Sender, Receiver),
      members: [Sender, Receiver],
    });
    return this.roomRepository.save(newRoom);
  }

  /**
   * It creates a message and saves it to the database
   * @param {any} sender - the user who sent the message
   * @param {any} receiver - any,
   * @param {string} msg - string - the message that the user wants to send
   * @returns A message object
   */
  async createMessage(
    sender: string,
    receiver: string,
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

  /**
   * It takes a socket, gets the authentication token from the cookie, gets the user from the
   * authentication token, and returns the user
   * @param {Socket} socket - Socket - The socket object that is connected to the client.
   * @returns The user object.
   */
  // async getUserFromSocket(socket: Socket) {
  //   const cookie = socket.handshake.headers.cookie;
  //   console.log(socket.handshake.headers.cookie);
  //   const { Authentication: authenticationToken } = parse(cookie);
  //   const user = await this.authService.verifyToken(authenticationToken);
  //   if (!user) {
  //     throw new WsException('Invalid credentials.');
  //   }
  //   return user;
  // }
  // async getUserFromSocket(socket) {
  //   const { authorization } = socket.handshake.headers;
  //   if (!authorization || !authorization.startsWith('Bearer ')) {
  //     throw new WsException('Invalid credentials.');
  //   }

  //   const token = authorization.substring(7); // Remover o prefixo 'Bearer '

  //   const user = await this.authService.verifyToken(token);
  //   if (!user) {
  //     throw new WsException('Invalid credentials.');
  //   }

  //   return user;
  // }
  async getUserFromSocket(socket: Socket) {
    const bearerToken = this.extractBearerTokenFromHeader(socket);

    if (!bearerToken) {
      throw new WsException('Bearer token not found.');
    }

    const user = await this.authService.verifyToken(bearerToken);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }
  private extractBearerTokenFromHeader(socket: Socket): string | undefined {
    const authorization = socket.handshake.headers?.authorization;
    return authorization.replace(/^Bearer\s(.*)/g, '$1');
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
