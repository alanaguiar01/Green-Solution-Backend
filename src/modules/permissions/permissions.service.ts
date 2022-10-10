import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const permissions = await this.findOne(createPermissionDto.name);
      if (permissions) {
        return new Error(`Role ${permissions.name} already exists`);
      }
      const createPermission =
        this.permissionRepository.create(createPermissionDto);
      return this.permissionRepository.save(createPermission);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const permissionExist = await this.permissionRepository.find();
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permissionExist;
  }

  async findOne(name: string) {
    const permissionExist = await this.permissionRepository.findOneBy({ name });
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permissionExist;
  }

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

  async remove(id: string) {
    const permissionExist = await this.permissionRepository.delete(id);
    if (!permissionExist) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permissionExist;
  }
}
