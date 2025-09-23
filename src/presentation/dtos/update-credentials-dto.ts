import { IsNotEmpty, IsEmpty } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  email: string;

  constructor(partial: Partial<VerifyEmailDto>) {
    Object.assign(this, partial);
  }
}
export class UpdateCredentialsDto {
  @IsEmpty()
  @IsNotEmpty()
  id: string;

  @IsEmpty()
  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<UpdateCredentialsDto>) {
    Object.assign(this, partial);
  }
}
