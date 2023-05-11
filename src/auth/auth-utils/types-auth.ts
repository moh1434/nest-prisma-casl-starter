import { AuthUser } from '@prisma/client';
import { OmitStrict } from '../../-global/global_types';

export type TokenData = OmitStrict<AuthUser, 'password' | 'email'>;

export type AuthUserWithoutPassword = OmitStrict<AuthUser, 'password'>;
