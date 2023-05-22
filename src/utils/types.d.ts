import { TokenData } from 'src/auth/auth-utils/types-auth';
import { Request } from 'express';
import { CaslForbiddenErrorI } from './casl/casl-rules.factory';

export type OmitStrict<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>;
//

export type RequestExtended = Request & {
  user: TokenData;
  forbiddenError: CaslForbiddenErrorI;
};
