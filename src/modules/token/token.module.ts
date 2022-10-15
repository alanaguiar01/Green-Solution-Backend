import { forwardRef, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { tokenProviders } from './token.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule), UserModule],
  controllers: [TokenController],
  providers: [TokenService, ...tokenProviders],
  exports: [TokenService],
})
export class TokenModule {}
