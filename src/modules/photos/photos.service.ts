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
  /**
   * If the photo doesn't exist, throw an error. Otherwise, create a new photo and save it
   * @param {CreatePhotoDto} createPhotoDto - CreatePhotoDto - This is the DTO that we created earlier.
   * @returns The photo that was created.
   */
  create(createPhotoDto: CreatePhotoDto) {
    const photo = this.photoRepository.create(createPhotoDto);
    return this.photoRepository.save(photo);
  }

  /**
   * The function is an async function that returns a promise. The function calls the find() method of
   * the photoRepository object. If the find() method returns a value, the function returns that value.
   * If the find() method returns a null value, the function throws an HttpException
   * @returns The photoExist variable is being returned.
   */
  async findAll() {
    const photoExist = await this.photoRepository.find();
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    return photoExist;
  }

  /**
   * It finds a photo by its id and if it doesn't exist, it throws an error
   * @param {string} id - string - The id of the photo we want to find.
   * @returns The photoExist is being returned.
   */
  async findOne(id: string) {
    const photoExist = await this.photoRepository.findOneBy({ id });
    if (!photoExist) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    return photoExist;
  }

  /**
   * It updates a photo by its id
   * @param {string} id - string - The id of the photo to update.
   * @param {UpdatePhotoDto} updatePhotoDto - UpdatePhotoDto
   * @returns The photo that was updated.
   */
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

  /**
   * It deletes a photo from the database and returns it
   * @param {string} id - string - The id of the photo to be deleted.
   * @returns The photo that was deleted.
   */
  async remove(id: string) {
    const photo = await this.photoRepository.delete(id);
    if (!photo) {
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
    return photo;
  }
}
