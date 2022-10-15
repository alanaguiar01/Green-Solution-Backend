import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './modules/token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './modules/chat/chat.module';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PostModule } from './modules/post/post.module';
import { AddressModule } from './modules/address/address.module';
import { PhotosModule } from './modules/photos/photos.module';
import { CategoryModule } from './modules/category/category.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        '.env.staging',
        '.env.development',
        '.env.testing',
        '.env.local',
      ],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TokenModule,
    JwtModule,
    ChatModule,
    ResetPasswordModule,
    RolesModule,
    PermissionsModule,
    ProfileModule,
    PostModule,
    AddressModule,
    PhotosModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: '/', method: RequestMethod.ALL });
  // }
}
