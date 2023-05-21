import { AuthUser } from '@prisma/client';
import { OmitStrict } from '../../utils/types';

export type TokenData = OmitStrict<
  AuthUser,
  'password' | 'refreshToken' | 'email'
>;

export type AuthUserWithoutPassword = OmitStrict<
  AuthUser,
  'password' | 'refreshToken'
>;

//
export type tokenPayload = TokenData & {
  iat: number;
  exp: number;
};
