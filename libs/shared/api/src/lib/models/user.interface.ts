import { Id } from './id.type';
import { IGame } from './game.interface';
import { IReview } from './review.interface';
import {Types} from 'mongoose';

export enum Role {
  Member = 'Member',
  Admin = 'Admin',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IUser {
  id: Id;
  name: string;
  emailAddress: string;
  password: string;
  birthDate: Date;
  address: Address;
  role: Role;
  ownedGames?: IGame[];
  reviewsGiven?: IReview[];
}

export type ICreateUser = Pick<
  IUser,
  'name' | 'emailAddress' | 'password' | 'birthDate' | 'address' | 'role' | 'ownedGames' | 'reviewsGiven'
>;

export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
