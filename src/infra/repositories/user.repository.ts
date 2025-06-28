import { Injectable } from '@nestjs/common';

import { IUserRepository, UserProps } from 'src/core';
import { PrismaService } from '../database';

@Injectable()
export class UserRepository implements IUserRepository {
  userDatabase: PrismaService;

  constructor(userDatabase: PrismaService) {
    this.userDatabase = userDatabase;
  }

  findById(id: string): Promise<UserProps | null> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<Partial<UserProps> | null> {
    const user = await this.userDatabase.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  create(user: UserProps): Promise<UserProps> {
    throw new Error('Method not implemented.');
  }
  update(user: UserProps): Promise<UserProps> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
