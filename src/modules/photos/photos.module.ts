import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { DatabaseModule } from 'src/database/database.module';
import { photoProviders } from './photo.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [PhotosController],
  providers: [PhotosService, ...photoProviders],
})
export class PhotosModule {}
