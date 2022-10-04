import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from './entities/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
