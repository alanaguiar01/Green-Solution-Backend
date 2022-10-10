import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  create(createProfileDto: CreateProfileDto) {
    const profileExists = this.profileRepository.hasId;
    if (profileExists) {
      throw new HttpException('Profile already exist', HttpStatus.BAD_REQUEST);
    }
    const profile = this.profileRepository.create(createProfileDto);
    return this.profileRepository.save(profile);
  }

  async findAll() {
    const profilesExists = await this.profileRepository.find();
    if (!profilesExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profilesExists;
  }

  async findOne(id: string) {
    const profileExists = await this.profileRepository.findOne({
      where: { id },
    });
    if (!profileExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profileExists;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profileExists = await this.profileRepository.findOneBy({ id });
    if (!profileExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    const updateProfile = this.profileRepository.update(
      { id },
      {
        avatar: updateProfileDto.avatar,
        about: updateProfileDto.about,
      },
    );
    return updateProfile;
  }

  async remove(id: string) {
    const profileExists = await this.profileRepository.findOneBy({ id });
    if (!profileExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    const profileDelete = this.profileRepository.delete(id);
    return profileDelete;
  }
}
