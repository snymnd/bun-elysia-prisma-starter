import { Elysia } from 'elysia';

import { authDTO } from '@/dto/authDTO';
import { userDTO } from '@/dto/userDTO';
import { AuthenticationError } from '@/exceptions/authError';
import { InvariantError } from '@/exceptions/invariantError';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { jwtUtil } from '@/utils/jwt';

import { HASH_COST } from '@/types/common';

export const authController = new Elysia({ prefix: '/auth' })
  .use(authDTO)
  .use(userDTO)
  .use(authService)
  .use(userService)
  .use(jwtUtil)
  //#region  //*=========== /signin ===========
  .post(
    '/signin',
    async ({ body, createUser, addRefreshToken, refreshJwt, set }) => {
      console.log(body);

      const passwordHash = await Bun.password.hash(body.password, {
        algorithm: 'bcrypt',
        cost: HASH_COST,
      });
      console.log(passwordHash);

      const { id: userId } = await createUser({
        ...body,
        password: passwordHash,
      });

      if (!userId) throw new InvariantError('User failed to be added');

      const refresh_token = await refreshJwt.sign({
        id: userId,
      });

      await addRefreshToken(refresh_token);

      set.status = 201;
      return {
        message: 'User successfully created',
        data: {
          userId: userId,
        },
      };
    },
    {
      body: 'userCreate',
    },
  )
  //#endregion  //*======== /signin ===========

  //#region  //*=========== /login ===========
  .post(
    '/login',

    async ({ body, loginUser, set, jwt }) => {
      const user = await loginUser(body);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const isMatch = await Bun.password.verify(body.password, user.password);
      if (!isMatch) {
        throw new AuthenticationError('Username or password is wrong');
      }

      const access_token = await jwt.sign({
        id: user.id,
      });

      set.status = 200;
      return {
        message: 'User Login Success',
        data: {
          username: user.username,
          email: user.email,
          token: access_token,
        },
      };
    },
    {
      body: 'userLogin',
    },
  )
  //#endregion  //*======== /login ===========

  //#region  //*=========== Refresh Token ===========
  .post(
    '/refresh-token',

    async ({ body, refreshToken, getUserById, set, jwt }) => {
      const isRefreshTokenExist = await refreshToken(body.refreshToken);
      if (!isRefreshTokenExist) {
        throw new AuthenticationError('Refresh token not found');
      }

      const { id: userId } = (await jwt.verify(body.refreshToken)) as {
        id: string;
      };
      const isIdExist = await getUserById(userId);
      if (!isIdExist) {
        throw new AuthenticationError('Refresh is not valid');
      }

      const accessToken = await jwt.sign({
        id: userId,
      });

      set.status = 200;
      return {
        message: 'Token successfully refreshed',
        data: {
          token: accessToken,
        },
      };
    },
    {
      body: 'refreshToken',
    },
  );
//#endregion  //*======== Refresh Token ===========
