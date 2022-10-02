import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolePermissionsRequest } from './dto/role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.findOne(createRoleDto.name);
      if (role) {
        return new Error(`Role ${role.name} already exists`);
      }
      const createRole = this.roleRepository.create(createRoleDto);
      return this.roleRepository.save(createRole);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOne(name: string) {
    try {
      const role = await this.roleRepository.findOne({ where: { name } });
      return role;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async createRolePermission(rolePermissionRequest: RolePermissionsRequest) {
    const role = await this.roleRepository.findOne({
      where: { id: rolePermissionRequest.roleId },
      relations: { permissions: true },
    });

    if (!role) {
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }

    const permissionsExists = await this.permissionRepository.findBy({
      id: In(rolePermissionRequest.permissions),
    });
    role.permissions = permissionsExists;
    return this.roleRepository.save(role);
  }
}
