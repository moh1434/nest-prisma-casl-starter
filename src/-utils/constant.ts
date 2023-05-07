export const COOKIE_AUTH_NAME = 'nest_login';
export const SECURE_COOKIE_OPTION = {
  httpOnly: true,
  secure: true,
  signed: true,
};

export const Kb = 1000;
export const Mb = 1000 * Kb;

//images prefixes:
export enum FilePrefix {
  empty = '',
  user = 'user-',
}
//keys
export const IS_PUBLIC_KEY = 'IS_PUBLIC';
export const CHECK_POLICIES_KEY = 'CHECK_POLICY';