import { IntersectionType } from '@nestjs/swagger';
import { Post } from '../generator-prisma-class/post';
import { PostRelations } from '../generator-prisma-class/post_relations';

export class PostWithAuthor extends IntersectionType(Post, PostRelations) {}
