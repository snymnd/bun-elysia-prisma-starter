import { PrismaClient } from '@prisma/client';
import { Elysia } from 'elysia';

import { UserCreate } from '@/dto/userDTO';
const db = new PrismaClient();

export const userService = new Elysia({ name: 'userService' }).derive(() => ({
  createUser: async (user: UserCreate) => {
    const userId = await db.users.create({
      data: user,
      select: {
        id: true,
      },
    });
    return userId;
  },
  getUserById: async (id: string) => {
    return await db.users.findUnique({
      where: {
        id,
      },
    });
  },
}));
