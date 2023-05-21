export type ErrorCode =
  | 'TOKEN_NOT_SEND'
  | 'TOKEN_INVALID'
  | 'WRONG_USER'
  | 'ALREADY_EXISTS'
  | 'NOT_FOUND'
  | 'FOREIGN_KEY_FAILED'
  | 'INVALID_CREDENTIALS';

type ShowToUserType = 'snackbar' | 'alert';

export interface ShowToUser {
  title?: string;
  message: string;
  type: ShowToUserType;
}

//Create custom exceptions:
//Use localization
//Centralized error handling
//Logging
//Hide technical details in production
