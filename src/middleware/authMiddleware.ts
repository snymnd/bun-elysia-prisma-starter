import bearer from '@elysiajs/bearer';
import { Elysia } from 'elysia';

import { AuthorizationError } from '@/exceptions/authError';
import { jwtUtil } from '@/utils/jwt';

export const authMiddleware = new Elysia({ name: 'isAuthenticated' })
  .use(jwtUtil)
  .use(bearer())
  .derive(async ({ jwt, bearer }) => {
    if (!bearer) throw new AuthorizationError('Token not found');

    const payload = (await jwt.verify(bearer)) as { id: string; exp: number };
    if (!payload) throw new AuthorizationError('Token not valid');

    if (payload.exp < Date.now()) {
      throw new AuthorizationError('Token expired');
    }
  });
