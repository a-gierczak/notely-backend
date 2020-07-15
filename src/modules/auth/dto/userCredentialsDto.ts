import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserCredentialsDto {
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please enter valid email address.' })
  email: string;

  @IsNotEmpty()
  password: string;
}
