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

  async findAll() {
    const photoExist = await this.photoRepository.find();
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    return photoExist;
  }

  async findOne(id: string) {
    const photoExist = await this.photoRepository.findOneBy({ id });
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    return photoExist;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photoExist = await this.photoRepository.findOneBy({ id });
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

  async remove(id: string) {
    const photo = await this.photoRepository.delete(id);
    if (!photo) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    return photo;
  }
}
