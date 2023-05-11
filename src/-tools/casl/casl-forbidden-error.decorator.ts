import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AppAbility, createForUser } from './casl-rules.factory';

import { ForbiddenError } from '@casl/ability';
import { RequestExtended } from '../../-global/global_types';

export type CaslForbiddenErrorI = ForbiddenError<AppAbility>;

export const CaslForbiddenError = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestExtended>();

    const ability = createForUser(request.user);

    ForbiddenError.from(ability);

    request.forbiddenError = ForbiddenError.from(ability);

    return request.forbiddenError;
  },
);
