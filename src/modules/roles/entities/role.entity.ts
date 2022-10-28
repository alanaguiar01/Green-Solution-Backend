import { Permission } from '~/modules/permissions/entities/permission.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntityModel } from '~/common/baseModel';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';

@Entity({ name: 'roles' })
@ApiTags('Roles')
export class Role extends BaseEntityModel {
  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  description: string;

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'permissions_roles',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
  @ApiPropertyOptional()
  permissions: Permission[];
}
