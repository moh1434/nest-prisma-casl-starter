import { AuthUser } from './auth_user';
import { Post } from './post';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: () => AuthUser })
  AuthUser?: AuthUser;

  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @ApiProperty({ isArray: true, type: () => Post })
  Posts: Post[];
}
