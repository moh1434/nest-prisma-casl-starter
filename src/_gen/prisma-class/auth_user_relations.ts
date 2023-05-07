import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
