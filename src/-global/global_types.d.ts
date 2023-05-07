import { TokenData } from 'src/auth/auth-utils/types-auth';
import { Request } from 'express';
import { CaslForbiddenErrorI } from '../-tools/casl/casl-forbidden-error.decorator';
export {};

declare global {
  type OmitStrict<ObjectType, KeysType extends keyof ObjectType> = Pick<
    ObjectType,
    Exclude<keyof ObjectType, KeysType>
  >;
  //

  type RequestExtended = Request & {
    user: TokenData;
    forbiddenError: CaslForbiddenErrorI;
  };
}
