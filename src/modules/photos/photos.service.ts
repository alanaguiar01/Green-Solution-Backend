import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}
  create(createPhotoDto: CreatePhotoDto) {
    const photoExist = this.photoRepository.hasId;
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    const photo = this.photoRepository.create(createPhotoDto);
    return this.photoRepository.save(photo);
  }

  findAll() {
    const photoExist = this.photoRepository.hasId;
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    const photo = this.photoRepository.find();
    return photo;
  }

  findOne(id: string) {
    const photoExist = this.photoRepository.hasId;
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    const photo = this.photoRepository.findOne({ where: { id: id } });
    return photo;
  }

  update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photoExist = this.photoRepository.hasId;
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    const photo = this.photoRepository.update(
      { id },
      {
        url: updatePhotoDto.url,
      },
    );
    return photo;
  }

  remove(id: string) {
    const photoExist = this.photoRepository.hasId;
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    const photo = this.photoRepository.delete(id);
    return photo;
  }
}
