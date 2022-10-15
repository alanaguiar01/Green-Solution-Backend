import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { resetPasswordProviders } from './forgot-password.provider';

@Module({
  imports: [
    DatabaseModule,
    MailerModule.forRoot({
      transport: { host: 'mailhog', port: 1025 },
      defaults: {
        from: 'no-reply@localhost.com',
      },
    }),
    UserModule,
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, ...resetPasswordProviders],
})
export class ResetPasswordModule {}
