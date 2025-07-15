import { UserProps } from '../entities';

export interface IUserRepository {
  findById(id: string): Promise<UserProps | null>;
  findByEmail(
    email: string,
  ): Promise<Pick<UserProps, 'email' | 'id' | 'systemId'> | null>;
  create(user: UserProps): Promise<Partial<UserProps>>;
  update(user: Partial<UserProps>, description: string): Promise<void>;
  delete(id: string): Promise<void>;
  confirmEmail(id: string): Promise<{
    emailVerificationToken: string;
    emailVerificationTokenExpiresAt: Date;
  } | null>;
}
