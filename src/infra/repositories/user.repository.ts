import { Injectable } from '@nestjs/common';

import { IUserRepository, UserProps } from 'src/core';
import { PrismaService } from '../database';

import { generateToken } from '@shared/utils';

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
    | (Pick<UserProps, 'email' | 'id' | 'systemId' | 'name'> & {
        roles: { id: string; name: string }[];
      } & { emailVerificationToken: string })
    | null
  > {
    const user = await this.userDatabase.user.findUnique({
      where: { email },
      // include: {
      //   roles: {
      //     select: {
      //       id: true,
      //       role: {
      //         select: {
      //           name: true,
      //         },
      //       },
      //     },
      //   },
      // },
      select: {
        id: true,
        name: true,
        email: true,
        system_id: true,
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

    const token = generateToken();

    await this.userDatabase.user.update({
      where: { email },
      data: {
        emailVerificationToken: token,
        emailVerificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    return {
      id: user.id,
      email: user.email,
      systemId: user.system_id,
      name: user.name,
      emailVerificationToken: token,
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
        emailVerificationToken: generateToken(),
        emailVerificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
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
      emailVerificationToken: newUser.emailVerificationToken || undefined,
    };
  }
  async update(user: Partial<UserProps>, description: string): Promise<void> {
    await this.userDatabase.user.update({
      where: { id: user.id },
      data: {
        ...user,
        updatedAt: new Date(),
      },
    });

    if (user.id) {
      await this.userDatabase.userUpdateHistory.create({
        data: {
          user_id: user.id,
          description: description,
          updatedAt: new Date(),
        },
      });
    }
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async confirmEmail(id: string): Promise<{
    emailVerificationToken: string;
    emailVerificationTokenExpiresAt: Date;
  } | null> {
    const user = (await this.userDatabase.user.findUnique({
      where: { id },
      select: {
        emailVerificationToken: true,
        emailVerificationTokenExpiresAt: true,
      },
    })) as {
      emailVerificationToken: string;
      emailVerificationTokenExpiresAt: Date;
    } | null;

    return user;
  }
}
