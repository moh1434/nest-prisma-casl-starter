import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import { UpdateUserWithAvatarDto } from '../auth/dto/update-user.dto';
import { Prisma } from '@prisma/client';

import { FilePrefix } from '../utils/constant';
import { S3Service } from '../s3/s3.service';
import { PaginationArgs, paginator } from '../utils/paginators.ts/paginator';
import { PaginatorDto } from '../utils/paginators.ts/dto/paginator.normal.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}
  static readonly select = {
    id: true,
    avatar: true,
  } satisfies Prisma.UserSelect;

  async findAll(paginatorDto: PaginatorDto) {
    const paginatorQuery = async (paginationArgs: PaginationArgs) => {
      return {
        total: await this.prisma.user.count(),
        data: await this.prisma.user.findMany({
          ...paginationArgs,
          select: UserService.select,
        }),
      };
    };
    const users = await paginator<ReturnType<typeof paginatorQuery>>(
      paginatorQuery,
      paginatorDto,
    );

    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: UserService.select,
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserWithAvatarDto,
    oldToDelete: string | null,
  ) {
    let prefixedLink: string | undefined;
    if (updateUserDto.file) {
      prefixedLink = await this.s3Service.replaceObject(
        {
          newFile: updateUserDto.file,
          oldToDelete,
        },
        FilePrefix.user,
      );
    }

    delete updateUserDto['file'];

    const newUser = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, avatar: prefixedLink },
      select: UserService.select,
    });
    return newUser;
  }

  async remove(id: string) {
    this.prisma.$transaction(async (tx) => {
      await tx.authUser.delete({
        where: { id },
      });
      await tx.user.delete({
        where: { id },
      });
    });
  }
}
