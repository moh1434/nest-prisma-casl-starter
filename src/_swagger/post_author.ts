import { IntersectionType } from '@nestjs/swagger';
import { Post } from '../_gen/prisma-class/post';
import { PostRelations } from '../_gen/prisma-class/post_relations';

export class PostWithAuthor extends IntersectionType(Post, PostRelations) {}
