import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  AppAbility,
  createForUser,
} from './casl-ability.factory/casl-ability.factory';

import { ForbiddenError } from '@casl/ability';

import { TokenData } from '../auth/types-auth';

export type CaslForbiddenErrorI = ForbiddenError<AppAbility>;

export const CaslForbiddenError = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const ability = createForUser(request.user as TokenData);

    ForbiddenError.from(ability);

    request.forbiddenError = ForbiddenError.from(ability);

    return request.forbiddenError as CaslForbiddenErrorI;
  },
);
