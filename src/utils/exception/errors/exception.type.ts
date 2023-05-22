export type ErrorCode =
  | 'TOKEN_NOT_SEND'
  | 'TOKEN_INVALID'
  | 'WRONG_USER'
  | 'ALREADY_EXISTS'
  | 'NOT_FOUND'
  | 'FOREIGN_KEY_FAILED'
  | 'INVALID_CREDENTIALS';

type ShowToUserType = 'snackbar' | 'alert';

export interface ExceptionDetails {
  message: string | string[];
  showAs?: ShowToUserType;
  title?: string;
}

//Create custom exceptions:
//Use localization
//Centralized error handling
//Logging
//Hide technical details in production
