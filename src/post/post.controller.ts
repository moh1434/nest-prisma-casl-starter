import { CreatePostDto } from './dto/create-post.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post as PostMethod,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from '../_gen/prisma-class/post';
import { TokenData } from '../auth/types-auth';
import { JwtUser } from '../auth/user.decorator';
import {
  CaslForbiddenError,
  CaslForbiddenErrorI,
} from '../casl/casl.decorator';
import { subject } from '@casl/ability';

import { PostWithAuthor } from '../_swagger/post_author';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/mine')
  async findMine(@JwtUser() authUser: TokenData): Promise<Post[]> {
    return await this.postService.findMine(authUser.id);
  }

  @Get('/author/:id')
  async findByAuthorId(@Param('id') id: string): Promise<Post[]> {
    return await this.postService.findByAuthorId(id);
  }

  @Get('/:id')
  async findById(
    @Param('id') id: string,
    @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
  ): Promise<PostWithAuthor> {
    const post = await this.postService.findById(id);

    forbiddenError.throwUnlessCan('read', subject('Post', post));

    return post;
  }

  @PostMethod('/')
  async createByUser(
    @Body() body: CreatePostDto,
    @JwtUser() authUser: TokenData,
  ): Promise<Post> {
    return await this.postService.create(body, authUser.id);
  }

  @Roles(UserType.ADMIN)
  @PostMethod('/admin/create')
  async createByAdmin(
    @Body() body: CreatePostDto,
    @JwtUser() authUser: TokenData,
  ): Promise<Post> {
    return await this.postService.create(body, authUser.id, true);
  }
}
