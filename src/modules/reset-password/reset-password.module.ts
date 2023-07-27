import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from './entities/reset-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPassword]),
    MailerModule.forRoot({
      transport: { host: 'localhost', port: 1025 },
      defaults: {
        from: 'alanaguiar01@gmail.com',
      },
    }),
    UserModule,
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
