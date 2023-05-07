import { AuthUser } from '@prisma/client';

export type TokenData = OmitStrict<AuthUser, 'password' | 'email'>;

export type AuthUserWithoutPassword = OmitStrict<AuthUser, 'password'>;
