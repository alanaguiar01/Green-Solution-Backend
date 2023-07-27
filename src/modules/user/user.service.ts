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
    private userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  /**
   * It creates a user with the role of 'user' and saves it to the database
   * @param {CreateUserDto} userRegisterDto - CreateUserDto
   * @returns The user object
   */
  async createUser(userRegisterDto: CreateUserDto) {
    const role = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });
    if (!role) {
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }
    const user = this.userRepository.create({
      roles: [role],
      ...userRegisterDto,
    });
    await this.userRepository.save(user);
    return user;
  }

  /**
   * It finds all users in the database and returns them
   * @returns An array of users
   */
  findAll() {
    const user = this.userRepository.find();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * It finds a user by id, and if it doesn't find one, it throws an error
   * @param {string} id - string - The id of the user we want to find.
   * @returns The user object with the id that was passed in.
   */
  findOneById(id: string) {
    const getOneUser = this.userRepository.findOne({
      where: { id },
      relations: ['permissions', 'roles'],
    });
    if (!getOneUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return getOneUser;
  }

  /**
   * It finds a user by email and if it doesn't find one, it throws an error
   * @param {string} email - The email of the user we want to find.
   * @returns The user object
   */
  findOneByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * It takes an id and an updateUserDto object as parameters, checks if the user exists, and if it
   * does, it updates the user with the new data
   * @param {string} id - The id of the user to be updated.
   * @param {UpdateUserDto} updateUserDto - UpdateUserDto
   * @returns The user object
   */
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
        password: updateUserDto.password,
      },
    );
    return user;
  }

  /**
   * It deletes a user from the database by id
   * @param {string} id - string - The id of the user to be deleted
   * @returns The user that was deleted.
   */
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

  /**
   * It takes a userACLRequest object, finds a user by the userId in the request, checks if the user
   * exists, checks if the permissions and roles in the request exist, then saves the user with the new
   * permissions and roles
   * @param {UserACLRequest} userACLRequest - UserACLRequest
   * @returns The user object with the new permissions and roles.
   */
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
    this.userRepository.save(user);
    return user;
  }
}
