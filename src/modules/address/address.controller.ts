import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAddressSwagger } from '~/common/swagger/address/create-address.swagger';
import { IndexAddressSwagger } from '~/common/swagger/address/index-address.swagger';
import { ShowAddressSwagger } from '~/common/swagger/address/show-address.swagger';
import { UpdateAddressSwagger } from '~/common/swagger/address/update-address.swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import PermissionGuard from '~/guards/permission.guard';
import RoleGuard from '~/guards/role.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new address of user' })
  @ApiResponse({
    status: 201,
    description: 'Create a new address with success',
    type: CreateAddressSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['create_category']),
  )
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all address of user' })
  @ApiResponse({
    status: 200,
    description: 'List all successfully returned',
    type: IndexAddressSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_category']),
  )
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'List one address of user' })
  @ApiResponse({
    status: 200,
    description: 'List one address successfully returned',
    type: ShowAddressSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_category']),
  )
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one address of user' })
  @ApiResponse({
    status: 200,
    description: 'Update address with successfully',
    type: UpdateAddressSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Update invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Update not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_address']),
  )
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['delete_address']),
  )
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
