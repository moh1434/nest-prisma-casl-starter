import { Post } from '@prisma/client';
import { TokenData } from './../../auth/types-auth';

export type SubjectsList = {
  User: TokenData;
  Post: Post;
};
