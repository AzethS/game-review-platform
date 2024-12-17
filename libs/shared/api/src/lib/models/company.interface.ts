import { Id } from './id.type';

export interface ContactInformation {
  phoneNumber: string;
  email: string;
  website?: string;
}

type Game = Id;

export interface ICompany {
  id: Id;
  name: string;
  location: string;
  description: string;
  contactInformation: ContactInformation;
  gamesCreated: Game[];
}

export type ICreateCompany = Pick<
  ICompany,
  'name' | 'location' | 'description' | 'contactInformation' | 'gamesCreated'
>;

export type IUpdateCompany = Partial<Omit<ICompany, 'id'>>;
export type IUpsertCompany = ICompany;
