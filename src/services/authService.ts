import { PrismaClient } from '@prisma/client';
import { Elysia } from 'elysia';

import { UserLogin } from '@/dto/authDTO';

const db = new PrismaClient();

export const authService = new Elysia({ name: 'authService' }).derive(() => ({
  loginUser: async (user: UserLogin) => {
    const foundedUser = await db.users.findFirst({
      where: {
        OR: [{ username: user.username }, { email: user.email }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
    return foundedUser;
  },

  addRefreshToken: async (refreshToken: string) => {
    const auth = await db.authentications.create({
      data: {
        token: refreshToken,
      },
      select: {
        token: true,
      },
    });
    return auth;
  },

  refreshToken: async (refreshToken: string) => {
    const auth = await db.authentications.findFirst({
      where: {
        token: refreshToken,
      },
      select: {
        token: true,
      },
    });
    return auth;
  },
}));
