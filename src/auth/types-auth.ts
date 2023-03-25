import { User, UserType } from '@prisma/client';

export type TokenData = {
  id: string;
  type: UserType;
};

export type UserWithoutPassword = OmitStrict<User, 'password'>;
