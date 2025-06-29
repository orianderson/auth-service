import { UserProps } from '../entities';

export interface IUserRepository {
  findById(id: string): Promise<UserProps | null>;
  findByEmail(email: string): Promise<Pick<UserProps, 'email' | 'id'> | null>;
  create(user: UserProps): Promise<Partial<UserProps>>;
  update(user: UserProps): Promise<UserProps>;
  delete(id: string): Promise<void>;
}
