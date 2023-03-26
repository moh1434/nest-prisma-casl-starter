import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtUser } from '../auth/user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from '@prisma/client';
import { TokenData } from 'src/auth/types-auth';
import { CheckPolicies } from '../casl/checkPolicies';
import {
  Action,
  AppAbility,
} from '../casl/casl-ability.factory/casl-ability.factory';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Roles(UserType.ADMIN)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'all'))
  @Get(':id')
  findOne(@Param('id') id: string, @JwtUser() user: TokenData) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
