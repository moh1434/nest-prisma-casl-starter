import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from '@prisma/client';
import { subject } from '@casl/ability';
import {
  CaslForbiddenError,
  CaslForbiddenErrorI,
} from '../casl/casl.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
  ) {
    const user = await this.userService.findOne(id);

    forbiddenError.throwUnlessCan('read', subject('User', user));

    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
  ) {
    const user = await this.userService.findOne(id);
    forbiddenError.throwUnlessCan('update', subject('User', user));

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
  ) {
    const user = await this.userService.findOne(id);

    forbiddenError.throwUnlessCan('delete', subject('User', user));

    return this.userService.remove(id);
  }
}
