import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolePermissionsRequest } from './dto/role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const createRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(createRole);
  }

  async findAll() {
    const role = await this.roleRepository.find();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async findOne(name: string) {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.update(
      { id },
      { name: updateRoleDto.name, description: updateRoleDto.description },
    );
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async remove(id: string) {
    const role = await this.roleRepository.delete(id);
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
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
