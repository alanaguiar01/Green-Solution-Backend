import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.hasId;
    if (category) {
      return new HttpException('Category already exists', HttpStatus.NOT_FOUND);
    }
    const createCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(createCategory);
  }

  async findAll() {
    const category = await this.categoryRepository.find();
    if (!category) {
      throw new HttpException('Category not Found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  findOne(id: string) {
    const category = this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new HttpException('', HttpStatus.NOT_FOUND);
    }
    const deleteCategory = await this.categoryRepository.update(
      { id },
      {
        name: updateCategoryDto.name,
      },
    );
    return deleteCategory;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.delete(id);
    if (!category) {
      throw new HttpException('', HttpStatus.NOT_FOUND);
    }
    return category;
  }
}
