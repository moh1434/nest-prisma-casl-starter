import { Request, Route } from 'tsoa';
import { CreatePostDto } from './dto/create-post.dto';
import {
  Body,
  CacheTTL,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';

import { TokenData } from '../auth/auth-utils/types-auth';
import { JwtUser } from '../auth/auth-utils/user.decorator';
import {
  CaslForbiddenError,
  CaslForbiddenErrorI,
} from '../-tools/casl/casl-forbidden-error.decorator';
import { subject } from '@casl/ability';
import { Roles } from '../auth/auth-utils/roles.decorator';
import { UserType } from '@prisma/client';
import { cacheMinute } from '../-utils/constant';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Route('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/mine')
  async findMine(@Request() @JwtUser() tokenData: TokenData) {
    return await this.postService.findMine(tokenData.id);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(cacheMinute * 2) // override TTL to 2 minutes
  @Get('/author/:id')
  async findByAuthorId(@Request() @Param('id') id: string) {
    return await this.postService.findByAuthorId(id);
  }

  @Get('/:id')
  async findById(
    @Request() @Param('id') id: string,
    @Request() @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
  ) {
    const post = await this.postService.findById(id);

    forbiddenError.throwUnlessCan('read', subject('Post', post));

    return post;
  }

  @Post('/')
  async createByUser(
    @Request() @Body() body: CreatePostDto,
    @Request() @JwtUser() tokenData: TokenData,
  ) {
    return await this.postService.create(body, tokenData.id);
  }

  @Roles(UserType.ADMIN)
  @Post('/admin/create')
  async createByAdmin(
    @Request() @Body() body: CreatePostDto,
    @Request() @JwtUser() tokenData: TokenData,
  ) {
    return await this.postService.create(body, tokenData.id, true);
  }
}
