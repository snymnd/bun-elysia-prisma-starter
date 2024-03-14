import { Elysia, Static, t } from 'elysia';

//#region  //*=========== Login User ===========
const userLogin = t.Object({
  email: t.Optional(t.String()),
  username: t.Optional(t.String()),
  password: t.String(),
});

export type UserLogin = Static<typeof userLogin>;
//#endregion  //*======== Login User ===========

//#region  //*=========== refresh token ===========
const refreshToken = t.Object({
  refreshToken: t.String(),
});
//#endregion  //*======== refresh token ===========

export const authDTO = new Elysia({ name: 'authDTO' }).model({
  userLogin,
  refreshToken,
});
