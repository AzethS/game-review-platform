export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  games: string[]; // References to Game
}

// CRUD utility types remain the same
export type ICreateUser = Pick<IUser, 'username' | 'email' | 'password'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
