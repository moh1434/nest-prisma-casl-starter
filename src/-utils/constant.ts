export const COOKIE_ACCESS_TOKEN_NAME = 'nest_login';
export const COOKIE_REFRESH_TOKEN_NAME = 'nest_refresh_token';

export const SECURE_COOKIE_OPTION = {
  httpOnly: true,
  secure: true,
  signed: true,
};

export const Kb = 1000;
export const Mb = 1000 * Kb;

export const cacheMinute = 1000 * 60;

//images prefixes:
export enum FilePrefix {
  empty = '',
  user = 'user-',
}
//keys
export const IS_PUBLIC_KEY = 'IS_PUBLIC';
export const CHECK_POLICIES_KEY = 'CHECK_POLICY';
