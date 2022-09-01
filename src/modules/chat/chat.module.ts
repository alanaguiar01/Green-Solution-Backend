import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Room]),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [ChatController],

  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
