import { AuthUser as _AuthUser } from './auth_user';
import { User as _User } from './user';
import { Post as _Post } from './post';

export namespace PrismaModel {
  export class AuthUser extends _AuthUser {}
  export class User extends _User {}
  export class Post extends _Post {}

  export const extraModels = [AuthUser, User, Post];
}
