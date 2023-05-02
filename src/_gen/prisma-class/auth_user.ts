import { User } from './user';
import { UserType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ enum: UserType, enumName: 'UserType' })
  type: UserType = UserType.USER;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: () => User })
  user: User;
}
