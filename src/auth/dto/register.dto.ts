import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsNoSpaces, Match } from 'src/common/decorators/validation.decorators';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNoSpaces({ message: 'Password cannot contain spaces' })
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsString({ message: 'Name must be a string' })
  name: string;
}
