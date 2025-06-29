import { UserProps } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserProps | null>;
  findByEmail(email: string): Promise<Partial<UserProps> | null>;
  create(user: UserProps): Promise<Partial<UserProps>>;
  update(user: UserProps): Promise<UserProps>;
  delete(id: string): Promise<void>;
}
