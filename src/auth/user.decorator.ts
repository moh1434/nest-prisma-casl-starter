import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenData } from './types-auth';

export const JwtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TokenData;
  },
);
