import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './modules/token/token.module';
import { LoggerMiddleware } from './middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './modules/chat/chat.module';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PostModule } from './modules/post/post.module';
import { AddressModule } from './modules/address/address.module';
import { PhotosModule } from './modules/photos/photos.module';
import { CategoryModule } from './modules/category/category.module';

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
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [__dirname + '/../**/*.entity.js'],
          synchronize: true,
        };
      },
    }),
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
