import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  /**
   * It creates a new post using the createPostDto object, and then saves it to the database
   * @param {CreatePostDto} createPostDto - CreatePostDto - This is the DTO that we created earlier.
   * @returns The post that was created.
   */
  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  /**
   * It finds all the posts in the database and returns them
   * @returns An array of all the posts in the database.
   */
  async findAll() {
    const postExist = await this.postRepository.find();
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postExist;
  }

  /**
   * It finds a post by its id and if it doesn't exist, it throws an error
   * @param {string} id - string - The id of the post we want to find.
   * @returns The postExist variable is being returned.
   */
  async findOne(id: string) {
    const postExist = await this.postRepository.findOneBy({ id });
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postExist;
  }

  /**
   * It takes an id and an updatePostDto as arguments, checks if the post exists, and if it does, it
   * updates the post with the new data
   * @param {string} id - The id of the post to be updated.
   * @param {UpdatePostDto} updatePostDto - UpdatePostDto
   * @returns The updated post
   */
  async update(id: string, updatePostDto: UpdatePostDto) {
    const postExist = await this.postRepository.findOneBy({ id });
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.update(
      { id },
      {
        price: updatePostDto.price,
        name: updatePostDto.name,
        description: updatePostDto.description,
      },
    );
    return post;
  }

  /**
   * It deletes a post by id and returns the deleted post
   * @param {string} id - string - The id of the post to be deleted.
   * @returns The post that was deleted.
   */
  async remove(id: string) {
    const postExist = await this.postRepository.delete(id);
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postExist;
  }
}
