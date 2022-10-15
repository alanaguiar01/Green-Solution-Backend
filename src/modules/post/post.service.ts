import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly postRepository: Repository<Post>,
  ) {}
  create(createPostDto: CreatePostDto) {
    const postExist = this.postRepository.hasId;
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll() {
    const postExist = await this.postRepository.find();
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postExist;
  }

  async findOne(id: string) {
    const postExist = await this.postRepository.findOneBy({ id });
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postExist;
  }

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

  async remove(id: string) {
    const postExist = await this.postRepository.delete(id);
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postExist;
  }
}
