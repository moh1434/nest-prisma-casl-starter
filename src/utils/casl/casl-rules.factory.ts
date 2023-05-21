import { TokenData } from '../../auth/auth-utils/types-auth';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { SubjectsList } from './generated/subjectsList';

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type AppAbility = PureAbility<
  [Action, Subjects<SubjectsList> | 'all'],
  PrismaQuery
>;

export function createForUser(user: TokenData) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility,
  );

  if (user.type === 'ADMIN') {
    can('manage', 'all'); // read-write access to everything
  } else {
    can('manage', 'AuthUser', { id: user.id });
    can('manage', 'Post', {
      authorId: user.id,
    });
    cannot('delete', 'Post', { isPublished: true });
  }

  return build();
}
