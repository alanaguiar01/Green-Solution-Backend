import { DataSource } from 'typeorm';
import { ResetPassword } from './entities/reset-password.entity';

export const resetPasswordProviders = [
  {
    provide: 'RESETPASSWORD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ResetPassword),
    inject: ['DATA_SOURCE'],
  },
];
