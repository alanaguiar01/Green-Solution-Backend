import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserACLRequest } from './dto/user-acl-request.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}
  async createUser(userRegisterDto: CreateUserDto) {
    const user = this.userRepository.create(userRegisterDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: string) {
    const getOneUser = await this.userRepository.findOne({ where: { id } });
    if (!getOneUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return getOneUser;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      { id },
      {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    );
  }

  async deleteUser(id: string) {
    const deleteUser = await this.userRepository.delete({
      id,
    });
    return deleteUser;
  }

  async CreateUserAccessControlListService(userACLRequest: UserACLRequest) {
    const user = await this.userRepository.findOne({
      where: {
        id: userACLRequest.userId,
      },
      relations: { permissions: true, roles: true },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const permisionExists = await this.permissionRepository.findBy({
      id: In(userACLRequest.permissions),
    });
    const rolesExists = await this.rolesRepository.findBy({
      id: In(userACLRequest.roles),
    });

    user.permissions = permisionExists;
    user.roles = rolesExists;
    user.save();

    return user;
  }
}
