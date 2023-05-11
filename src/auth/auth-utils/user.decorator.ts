import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestExtended } from '../../-global/global_types';

export const JwtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestExtended>();
    return request.user;
  },
);
