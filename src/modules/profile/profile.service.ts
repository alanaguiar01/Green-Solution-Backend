import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('PROFILE_REPOSITORY')
    private readonly profileRepository: Repository<Profile>,
  ) {}
  /**
   * If the profile exists, throw an error, otherwise create a new profile and save it
   * @param {CreateProfileDto} createProfileDto - CreateProfileDto - This is the DTO that we created
   * earlier.
   * @returns The profile that was created.
   */
  create(createProfileDto: CreateProfileDto) {
    const profile = this.profileRepository.create(createProfileDto);
    return this.profileRepository.save(profile);
  }

  /**
   * It finds all the profiles in the database and returns them
   * @returns An array of profiles
   */
  async findAll() {
    const profilesExists = await this.profileRepository.find();
    if (!profilesExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profilesExists;
  }

  /**
   * It finds a profile by id and throws an error if it doesn't exist
   * @param {string} id - string - The id of the profile we want to find.
   * @returns The profileExists variable is being returned.
   */
  async findOne(id: string) {
    const profileExists = await this.profileRepository.findOne({
      where: { id },
    });
    if (!profileExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profileExists;
  }

  /**
   * It updates a profile by id
   * @param {string} id - The id of the profile to be updated.
   * @param {UpdateProfileDto} updateProfileDto - UpdateProfileDto
   * @returns The updated profile
   */
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

  /**
   * It checks if the profile exists, if it does, it deletes it
   * @param {string} id - The id of the profile to be deleted.
   * @returns The profileDelete is being returned.
   */
  async remove(id: string) {
    const profileExists = await this.profileRepository.findOneBy({ id });
    if (!profileExists) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    const profileDelete = this.profileRepository.delete(id);
    return profileDelete;
  }
}
