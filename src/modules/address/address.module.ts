import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { DatabaseModule } from 'src/database/database.module';
import { addressProviders } from './address.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [AddressController],
  providers: [AddressService, ...addressProviders],
})
export class AddressModule {}
