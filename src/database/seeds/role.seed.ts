import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '~/modules/roles/entities/role.entity';

export default class RoleSeed implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    await roleRepository.insert([
      {
        name: 'user',
        description: 'user common in system',
      },
      {
        name: 'manager',
        description: 'manager in system with ',
      },
      {
        name: 'creator',
        description: 'creator of system',
      },
    ]);
  }
}
