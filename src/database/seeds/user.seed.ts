import { User } from '~/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '~/modules/roles/entities/role.entity';
import { Permission } from '~/modules/permissions/entities/permission.entity';
export default class UserSeed implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    const role = await roleRepository.findOneBy({ name: 'user' });
    const permissionRepository = dataSource.getRepository(Permission);
    const permission = await permissionRepository.findOneBy({
      name: 'create_profile',
    });
    const userFactory = factoryManager.get(User);
    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5, {
      roles: [role],
      permissions: [permission],
    });
  }
}

// const userRepository = dataSource.getRepository(User);
// const roleExist = await role.findOneBy({ name: 'user' });
// const userData = {
//   name: 'alan martins',
//   email: 'alan@alanmartins.com',
//   password: await argon2.hash('applyteste'),
// };
// const userExists = await userRepository.findOneBy({
//   email: userData.email,
// });
// if (!userExists) {
//   const newUser = userRepository.create({
//     roles: [roleExist],
//     ...userData,
//   });
//   const userFactory = factoryManager.get(User);
//   // save 5 factory generated entities, to the database
//   await userFactory.saveMany(5, newUser);
// }
