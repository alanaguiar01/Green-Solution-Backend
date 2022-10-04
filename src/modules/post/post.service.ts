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
  create(createPostDto: CreatePostDto) {
    const postExist = this.postRepository.hasId;
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  findAll() {
    const postExist = this.postRepository.hasId;
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.find();
    return post;
  }

  findOne(id: string) {
    const postExist = this.postRepository.hasId;
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.findOne({ where: { id } });
    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const postExist = this.postRepository.hasId;
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

  remove(id: string) {
    const postExist = this.postRepository.hasId;
    if (!postExist) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.delete(id);
    return post;
  }
}
