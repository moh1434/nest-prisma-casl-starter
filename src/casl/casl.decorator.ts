import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AppAbility, createForUser } from './casl-ability.factory';

import { ForbiddenError } from '@casl/ability';

export type CaslForbiddenErrorI = ForbiddenError<AppAbility>;

export const CaslForbiddenError = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestExtended>();

    const ability = createForUser(request.user);

    ForbiddenError.from(ability);

    request.forbiddenError = ForbiddenError.from(ability);

    return request.forbiddenError as CaslForbiddenErrorI;
  },
);
