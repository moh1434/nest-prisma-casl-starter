import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class PostRelations {
  @ApiProperty({ type: () => User })
  author: User;
}
