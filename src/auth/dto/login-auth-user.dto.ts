import { IsEmail, IsString } from 'class-validator';

export class LoginAuthUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
