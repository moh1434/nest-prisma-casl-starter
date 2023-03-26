import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './CaslPolicies';
import { CHECK_POLICIES_KEY } from '../utils/constant';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
