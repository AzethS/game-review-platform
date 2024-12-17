import { Id } from './id.type';

export enum Role {
    Member = 'Member',
    Admin = 'Admin'
}

type OwnedGames = Id;
type ReviewGiven = Id;

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
    ownedGames?: OwnedGames[];
    reviewsGiven?: ReviewGiven[];

}

export type ICreateUser = Pick<
    IUser,
    'name' | 'emailAddress' | 'password' | 'birthDate' | 'address' | 'role' | 'ownedGames' | 'reviewsGiven'
>;

export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
