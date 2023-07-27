import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Permission } from '~/modules/permissions/entities/permission.entity';

export default class PermissionSeed implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);
    await permissionRepository.insert([
      {
        name: 'create_profile',
        description: 'create profile of api',
      },
      {
        name: 'list_profile',
        description: 'list profiles of api',
      },
      {
        name: 'update_profile',
        description: ' update profile of api',
      },
      {
        name: 'delete_profile',
        description: 'delete profile of api',
      },
    ]);
  }
}
