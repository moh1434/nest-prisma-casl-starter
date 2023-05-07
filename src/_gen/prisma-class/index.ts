import { AuthUserRelations as _AuthUserRelations } from './auth_user_relations';
import { UserRelations as _UserRelations } from './user_relations';
import { PostRelations as _PostRelations } from './post_relations';
import { AuthUser as _AuthUser } from './auth_user';
import { User as _User } from './user';
import { Post as _Post } from './post';

export namespace PrismaModel {
  export class AuthUserRelations extends _AuthUserRelations {}
  export class UserRelations extends _UserRelations {}
  export class PostRelations extends _PostRelations {}
  export class AuthUser extends _AuthUser {}
  export class User extends _User {}
  export class Post extends _Post {}

  export const extraModels = [
    AuthUserRelations,
    UserRelations,
    PostRelations,
    AuthUser,
    User,
    Post,
  ];
}
