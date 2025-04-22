import { Id } from './id.type';
import { IGame } from './game.interface';

export interface IPlatform {
  id: Id;
  name: string;
  description: string;
  games?: IGame[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ICreatePlatform = Pick<IPlatform, 'name' | 'description'>;
export type IUpdatePlatform = Partial<Omit<IPlatform, 'id'>>;
export type IUpsertPlatform = IPlatform;
