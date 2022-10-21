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
  /**
   * It creates a new role using the data transfer object (DTO) and saves it to the database
   * @param {CreateRoleDto} createRoleDto - CreateRoleDto - This is the DTO that we created earlier.
   * @returns The role that was created.
   */
  async create(createRoleDto: CreateRoleDto) {
    const createRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(createRole);
  }

  /**
   * It finds all the roles in the database and returns them
   * @returns An array of all the roles in the database.
   */
  async findAll() {
    const role = await this.roleRepository.find();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  /**
   * It finds a role by name and returns it
   * @param {string} name - string - The name of the role we want to find.
   * @returns The role object
   */
  async findOne(name: string) {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  /**
   * It updates a role by id, and returns the updated role
   * @param {string} id - The id of the role to update.
   * @param {UpdateRoleDto} updateRoleDto - UpdateRoleDto - This is the DTO that we created earlier.
   * @returns The updated role
   */
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

  /**
   * It deletes a role from the database
   * @param {string} id - The id of the role to be deleted.
   * @returns The role that was deleted.
   */
  async remove(id: string) {
    const role = await this.roleRepository.delete(id);
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  /**
   * It finds a role by id, then finds permissions by id, then assigns the permissions to the role,
   * then saves the role
   * @param {RolePermissionsRequest} rolePermissionRequest - RolePermissionsRequest
   * @returns The role with the permissions
   */
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
