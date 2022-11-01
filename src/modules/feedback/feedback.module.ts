import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    MailerModule.forRoot({
      transport: { host: 'mailhog', port: 1025 },
      defaults: {
        from: 'no-reply@localhost.com',
      },
    }),
    UserModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
