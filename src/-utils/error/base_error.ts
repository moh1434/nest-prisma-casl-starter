import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  Validation = 'VALIDATION',
  TokenExpired = 'TOKEN_EXPIRED',
  TokenInvalid = 'TOKEN_INVALID',
}

export enum ShowToUserType {
  snackbar = 'snackbar',
  alert = 'alert',
}

interface ShowToUser {
  title?: string;
  messeage: string;
  type: ShowToUserType;
}

export interface CustomExceptionMessage {
  code: ErrorCode;
  showToUser?: ShowToUser;
}
// send request
//if 401 => use refreshToken if faield logout
// send the request again
// if 401 => login page
export class CustomException extends HttpException {
  constructor(error: CustomExceptionMessage, code: HttpStatus) {
    super(error, code);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(
      {
        message,
        code: ErrorCode.Unauthorized,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(message: CustomExceptionMessage) {
    super(
      {
        message,
        code: ErrorCode.Validation,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

//Create custom exceptions:
//Use localization
//Centralized error handling
//Logging
//Hide technical details in production
