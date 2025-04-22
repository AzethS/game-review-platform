import { Id } from './id.type';
import { IGame } from './game.interface';

export interface ContactInformation {
  phone: string;
  email: string;
  website?: string;
}

export interface ICompany {
  id: Id;
  name: string;
  location: string;
  description: string;
  contactInformation?: ContactInformation;
  gamesCreated?: IGame[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ICreateCompany = Pick<ICompany, 'name' | 'location' | 'description' | 'contactInformation'>;
export type IUpdateCompany = Partial<Omit<ICompany, 'id'>>;
export type IUpsertCompany = ICompany;
