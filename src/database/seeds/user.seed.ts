import { User } from '../../modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as argon2 from 'argon2';
export default class UserSeed implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    await userRepository.insert([
      {
        name: 'alan martins',
        email: 'alan@alanmartins.com',
        password: await argon2.hash('applyteste'),
      },
    ]);
    // const userData = {
    //   name: 'alan martins',
    //   email: 'alan@alanmartins.com',
    //   password: await argon2.hash('applyteste'),
    // };
    // const newUser = userRepository.create(userData);
    // await userRepository.save(newUser);
  }
}

// export default class InitialDatabaseSeed implements Seeder {
//   public async run(factory: Factory): Promise<void> {
//       const usuarios = await factory(Usuario)().createMany(30);
//       const responsaveis = usuarios.filter((usuario) => usuario.tipo === UsuarioTipoEnum.SERVENTIA);
//       const funcionarios = usuarios.filter((usuario) => usuario.tipo === UsuarioTipoEnum.USUARIO);

//       await factory(Serventia)()
//           .map(async (serventia) => {
//               serventia.responsavel = responsaveis[Math.floor(Math.random() * responsaveis.length)];
//               serventia.usuarios = funcionarios.slice(0, Math.floor(Math.random() * 10));
//               return serventia;
//           })
//           .createMany(10);
//   }
// }
