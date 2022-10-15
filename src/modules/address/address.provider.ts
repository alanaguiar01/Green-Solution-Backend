import { DataSource } from 'typeorm';
import { Address } from './entities/address.entity';

export const addressProviders = [
  {
    provide: 'ADDRESS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Address),
    inject: ['DATA_SOURCE'],
  },
];
