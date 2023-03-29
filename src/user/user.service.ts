import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  static readonly select = {
    id: true,
    email: true,
    type: true,
  } satisfies OmitStrict<Prisma.UserSelect, 'password'>;

  constructor(private prisma: PrismaService) {}
  async create(body: RegisterUserDto) {
    const user = await this.prisma.user.create({
      data: body,
      select: UserService.select,
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: UserService.select,
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: UserService.select,
    });
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        ...UserService.select,
        password: true, //i need the password for auth login
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const newUser = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
      select: UserService.select,
    });
    return newUser;
  }
  async updatePassword(id: string, hashedPassword: string) {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: UserService.select,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id: id,
      },
      select: { id: true },
    });
    return user;
  }
}
