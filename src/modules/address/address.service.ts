import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  /**
   * It creates an address object from the CreateAddressDto, and then saves it to the database
   * @param {CreateAddressDto} createAddressDto - CreateAddressDto - This is the DTO that we created
   * earlier.
   * @returns The address object that was created.
   */
  create(createAddressDto: CreateAddressDto) {
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  /**
   * If the address does not exist, throw an error. Otherwise, return the address
   * @returns An array of addresses
   */
  findAll() {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.find();
    return address;
  }

  /**
   * If the address doesn't exist, throw an error. Otherwise, return the address
   * @param {string} id - The id of the address you want to find.
   * @returns An address object
   */
  findOne(id: string) {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.find({ where: { id: id } });
    return address;
  }

  /**
   * It updates the address with the given id with the given data
   * @param {string} id - The id of the address to be updated.
   * @param {UpdateAddressDto} updateAddressDto - UpdateAddressDto
   * @returns The address that was updated.
   */
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

  /**
   * It checks if the address exists, if it does, it deletes it and returns the deleted address
   * @param {string} id - The id of the address to be deleted.
   * @returns The address that was deleted.
   */
  remove(id: string) {
    const addressExist = this.addressRepository.hasId;
    if (!addressExist) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }
    const address = this.addressRepository.delete(id);
    return address;
  }
}
