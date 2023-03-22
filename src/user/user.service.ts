import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: 'email@test.com',
        password: 'not-hashed-yet',
      },
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const newUser = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
    return newUser;
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
