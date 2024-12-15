import { Types } from 'mongoose';

export interface IPlatform {
  id: string;
  name: string;
  description?: string;
  games: Types.ObjectId[]; // References to games
}

export type ICreatePlatform = Pick<IPlatform, 'name' | 'description'>;

export type IUpdatePlatform = Partial<Omit<IPlatform, 'id' | 'games'>>;

export type IUpsertPlatform = IPlatform;
