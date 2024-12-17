import { Id } from './id.type';


type Game = Id;
export interface IPlatform {
  id: string;
  name: string;
  description?: string;
  games: Game[]; // References to games
}

export type ICreatePlatform = Pick<IPlatform, 'name' | 'description' | 'games'>;

export type IUpdatePlatform = Partial<Omit<IPlatform, 'id' >>;

export type IUpsertPlatform = IPlatform;