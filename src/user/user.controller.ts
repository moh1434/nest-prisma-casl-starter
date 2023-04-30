import { TokenData } from 'src/auth/types-auth';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from '@prisma/client';
import { subject } from '@casl/ability';
import {
  CaslForbiddenError,
  CaslForbiddenErrorI,
} from '../casl/casl.decorator';
import { Mb } from '../utils/constant';
import { ApiConsumes } from '@nestjs/swagger';
import { multerOptions } from '../s3/multer.config';
import { JwtUser } from '../auth/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  async findMyProfile(
    @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
    @JwtUser() authUser: TokenData,
  ) {
    const user = await this.userService.findOne(authUser.id);

    forbiddenError.throwUnlessCan('read', subject('User', user));

    return user;
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions(4 * Mb)))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CaslForbiddenError() forbiddenError: CaslForbiddenErrorI,
    @UploadedFile() file: Express.Multer.File,
  ) {
    delete updateUserDto.file;

    const user = await this.userService.findOne(id);
    forbiddenError.throwUnlessCan('update', subject('User', user));
    return this.userService.update(id, updateUserDto, {
      newFile: file,
      oldToDelete: user.avatar,
    });
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
