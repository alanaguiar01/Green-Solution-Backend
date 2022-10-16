import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  /**
   * It creates a new permission and saves it to the database
   * @param {CreatePermissionDto} createPermissionDto - CreatePermissionDto
   * @returns The createPermissionDto is being returned.
   */
  async create(createPermissionDto: CreatePermissionDto) {
    const permissions = await this.permissionRepository.findOneBy({
      name: createPermissionDto.name,
    });
    if (permissions) {
      return new Error(`Role ${permissions.name} already exists`);
    }
    const createPermission =
      this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(createPermission);
  }

  /**
   * It finds all the permissions in the database and returns them
   */
  async findAll() {
    const permissionExist = await this.permissionRepository.find();
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permissionExist;
  }

  /**
   * It finds a permission by name and returns it
   * @param {string} name - string - The name of the permission to find.
   * @returns The permissionExist is being returned.
   */
  async findOne(name: string) {
    const permissionExist = await this.permissionRepository.findOneBy({ name });
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permissionExist;
  }

  /**
   * It updates a permission by id
   * @param {string} id - The id of the permission to be updated.
   * @param {UpdatePermissionDto} updatePermissionDto - UpdatePermissionDto
   * @returns The updated permission
   */
  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permissionExist = await this.permissionRepository.findOneBy({ id });
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    const permission = this.permissionRepository.update(
      { id },
      {
        name: updatePermissionDto.name,
        description: updatePermissionDto.description,
      },
    );
    return permission;
  }

  /**
   * It deletes a permission from the database
   * @param {string} id - The id of the permission to be deleted.
   * @returns The permission that was deleted.
   */
  async remove(id: string) {
    const permissionExist = await this.permissionRepository.delete(id);
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permissionExist;
  }
}
