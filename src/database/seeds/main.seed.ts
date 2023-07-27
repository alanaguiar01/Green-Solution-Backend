import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import UserSeed from './user.seed';
import RoleSeed from './role.seed';
import PermissionSeed from './permission.seed';
export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, PermissionSeed);
    await runSeeder(dataSource, RoleSeed);
    await runSeeder(dataSource, UserSeed);
  }
}
