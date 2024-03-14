import jwt from '@elysiajs/jwt';
import { Elysia } from 'elysia';

export const jwtUtil = new Elysia({ name: 'isAuthenticated' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 20,
      typ: 'JWT',
    }),
  )
  .use(
    jwt({
      name: 'refreshJwt',
      secret: process.env.JWT_REFRESH_SECRET!,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 60,
      typ: 'JWT',
    }),
  );
