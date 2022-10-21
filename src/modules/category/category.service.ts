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
  /**
   * It creates a new category using the createCategoryDto object and then saves it to the database
   * @param {CreateCategoryDto} createCategoryDto - CreateCategoryDto - This is the DTO that we created
   * earlier.
   * @returns The category that was created.
   */
  create(createCategoryDto: CreateCategoryDto) {
    const createCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(createCategory);
  }

  /**
   * It finds all the categories in the database and returns them
   * @returns The category is being returned.
   */
  async findAll() {
    const category = await this.categoryRepository.find();
    if (!category) {
      throw new HttpException('Category not Found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  /**
   * It finds a category by id and if it doesn't exist, it throws an error
   * @param {string} id - The id of the category we want to find.
   * @returns The category object
   */
  findOne(id: string) {
    const category = this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  /**
   * It takes an id and an updateCategoryDto object, finds a category with that id, and if it exists,
   * updates it with the new name
   * @param {string} id - The id of the category to be updated.
   * @param {UpdateCategoryDto} updateCategoryDto - UpdateCategoryDto
   * @returns The updated category
   */
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

  /**
   * It deletes a category from the database
   * @param {string} id - The id of the category to be deleted.
   * @returns The category that was deleted.
   */
  async remove(id: string) {
    const category = await this.categoryRepository.delete(id);
    if (!category) {
      throw new HttpException('', HttpStatus.NOT_FOUND);
    }
    return category;
  }
}
