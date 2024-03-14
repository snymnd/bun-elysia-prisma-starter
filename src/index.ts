import cors from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { authController } from '@/controller/authController';
import { userController } from '@/controller/userController';
import {
  AuthenticationError,
  AuthorizationError,
} from '@/exceptions/authError';
import { InvariantError } from '@/exceptions/invariantError';

export type AppType = typeof app;

export const app = new Elysia({
  prefix: process.env.API_VERSION,
})
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('INVARIANT_ERROR', InvariantError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'AUTHENTICATION_ERROR':
        set.status = 401;
        return {
          status: 'error',
          message: error.toString(),
        };
      case 'AUTHORIZATION_ERROR':
        set.status = 403;
        return {
          status: 'error',
          message: error.toString(),
        };
      case 'INVARIANT_ERROR':
        set.status = 400;
        return {
          status: 'error',
          message: error.toString(),
        };
      case 'NOT_FOUND':
        set.status = 404;
        return {
          status: 'error',
          message: error.toString(),
        };
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500;
        return {
          status: 'error',
          message: 'Something went wrong!',
        };
    }
  })
  .use(cors())
  .use(
    swagger({
      path: '/swagger',
    }),
  )
  .get('/', () => 'Hello, Bun+Elysia+Prisma starter is ready')
  .use(authController)
  .use(userController)
  .listen(process.env.PORT ?? 5000);

console.log(
  `🦊 Elysia App is running:
  \t🔗url: http://${app.server?.hostname}:${app.server?.port}${process.env.API_VERSION}
  \t🧪swagger at http://${app.server?.hostname}:${app.server?.port}${process.env.API_VERSION}/swagger \n `,
);
