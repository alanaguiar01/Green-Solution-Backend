import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { chatProviders } from './chat.provider';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule), AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ...chatProviders],
})
export class ChatModule {}
