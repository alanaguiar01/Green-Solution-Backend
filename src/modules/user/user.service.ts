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

  createUser(userRegisterDto: CreateUserDto) {
    const user = this.userRepository.create(userRegisterDto);
    return this.userRepository.save(user);
  }

  findAll() {
    const user = this.userRepository.find();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  findOneById(id: string) {
    const getOneUser = this.userRepository.findOne({
      where: { id },
      relations: { permissions: true, roles: true },
    });
    if (!getOneUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return getOneUser;
  }

  findOneByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = this.userRepository.findOneBy({ id });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const user = this.userRepository.update(
      { id },
      {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    );
    return user;
  }

  deleteUser(id: string) {
    const userExists = this.userRepository.findOneBy({ id });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deleteUser = this.userRepository.delete({
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
