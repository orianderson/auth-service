import {
  IsEmail,
  Matches,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { RegisterUserInput, RegisterUserOutput } from '../../core';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  // @IsNotEmpty()
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   {
  //     message:
  //       'The password must contain: alphabetical character (lowercase, uppercase), at least 1 numeric character, at least one special character and must be eight characters or longer',
  //   },
  // )
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  acceptedTerms: boolean;

  @IsBoolean()
  @IsNotEmpty()
  acceptedPrivacyPolicy: boolean;

  @IsString()
  @IsNotEmpty()
  systemId: string;

  constructor(partial: Partial<RegisterUserInput>) {
    Object.assign(this, partial);
  }
}

export class CreateUserResponseDto {
  id?: string;
  email: string;
  name: string;
  createdAt?: Date;

  constructor(partial: Partial<RegisterUserOutput>) {
    Object.assign(this, partial);
  }
}
