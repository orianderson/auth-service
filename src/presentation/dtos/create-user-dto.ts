/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, Matches, IsString, IsEmpty } from 'class-validator';
import { RegisterUserInput, RegisterUserOutput } from '../../core';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsEmpty()
  email: string;

  @IsEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'The password must contain: alphabetical character (lowercase, uppercase), at least 1 numeric character, at least one special character and must be eight characters or longer',
    },
  )
  password: string;

  constructor(partial: Partial<RegisterUserInput>) {
    Object.assign(this, partial);
  }
}

export class CreateUserResponseDto {
  id?: string;
  email: string;
  createdAt?: Date;
  message: string;

  constructor(partial: Partial<RegisterUserOutput>) {
    Object.assign(this, partial);
  }
}
