import { AuthUser } from './auth_user';
import { Post } from './post';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UserRelations {
  @ApiPropertyOptional({ type: () => AuthUser })
  AuthUser?: AuthUser;

  @ApiProperty({ isArray: true, type: () => Post })
  Posts: Post[];
}
