import { Elysia } from 'elysia';

import { userDTO } from '@/dto/userDTO';
import { InvariantError } from '@/exceptions/invariantError';
import { authMiddleware } from '@/middleware/authMiddleware';
import { userService } from '@/services/userService';

export const userController = new Elysia({ prefix: '/users' })
  .use(userDTO)
  .use(userService)
  .use(authMiddleware)
  //#region  //*=========== /me ===========
  .get('/me', async ({ getUserById: getUser, jwt, bearer }) => {
    const payload = (await jwt.verify(bearer)) as { id: string };
    const user = await getUser(payload.id);
    if (!user) throw new InvariantError('User not found');
    return user;
  });
//#endregion  //*======== /me ===========
