import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @Inject('ADDRESS_REPOSITORY')
    private readonly addressRepository: Repository<Address>,
  ) {}
  create(createAddressDto: CreateAddressDto) {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  findAll() {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.find();
    return address;
  }

  findOne(id: string) {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.find({ where: { id: id } });
    return address;
  }

  update(id: string, updateAddressDto: UpdateAddressDto) {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.update(
      { id },
      {
        zipCode: updateAddressDto.zipCode,
      },
    );
    return address;
  }

  remove(id: string) {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.delete(id);
    return address;
  }
}
