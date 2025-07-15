import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  constructor(partial: Partial<ConfirmEmailDto>) {
    Object.assign(this, partial);
  }
}
