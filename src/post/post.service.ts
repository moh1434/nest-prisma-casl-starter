import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  static readonly select = {
    id: true,
    content: true,
    createdAt: true,
    isPublished: true,
    updatedAt: true,
    authorId: true,
  } satisfies Prisma.PostSelect;

  static readonly selectWithAuthor = {
    ...PostService.select,
    author: {
      select: UserService.select,
    },
  } satisfies Prisma.PostSelect;

  async findByAuthorId(id: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: id,
        isPublished: true,
      },
      select: PostService.select,
    });

    return posts;
  }
  async findMine(id: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: id,
      },
      select: PostService.select,
    });

    return posts;
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id },
      select: PostService.selectWithAuthor,
    });
    return post;
  }

  async create(body: CreatePostDto, authorId: string, isPublished = false) {
    const post = await this.prisma.post.create({
      data: {
        content: body.content,
        isPublished,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      select: PostService.select,
    });
    return post;
  }
}
