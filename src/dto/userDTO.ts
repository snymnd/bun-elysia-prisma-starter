import { Elysia, Static, t } from 'elysia';

//#region  //*=========== Create User ===========
const userCreate = t.Object({
  email: t.String(),
  username: t.String(),
  name: t.String(),
  password: t.String(),
  phoneNumber: t.Union([t.String(), t.Undefined()]),
});

export type UserCreate = Static<typeof userCreate>;
//#endregion  //*======== Create User ===========

export const userDTO = new Elysia({ name: 'userDTO' }).model({
  userCreate,
});
