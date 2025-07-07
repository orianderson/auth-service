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

  async findByEmail(email: string): Promise<
    | (Pick<UserProps, 'email' | 'id' | 'systemId'> & {
        roles: { id: string; name: string }[];
      })
    | null
  > {
    const user = await this.userDatabase.user.findUnique({
      where: { email },
      include: {
        roles: {
          select: {
            id: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      systemId: user.system_id,
      roles: user.roles.map((userRole) => ({
        id: userRole.id,
        name: userRole.role.name,
      })),
    };
  }

  async create(user: UserProps): Promise<Partial<UserProps>> {
    const newUser = await this.userDatabase.user.create({
      data: {
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        id: user.id,
        name: user.name,
        termsAccepted: !user.acceptedTerms ? false : user.acceptedTerms,
        privacyAccepted: !user.acceptedPrivacyPolicy
          ? false
          : user.acceptedPrivacyPolicy,
        system_id: user.systemId,
      },
    });

    await this.userDatabase.userRole.create({
      data: {
        role_id: user.roleId,
        user_id: newUser.id,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }
  update(user: UserProps): Promise<UserProps> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
