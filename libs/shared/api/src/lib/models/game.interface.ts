import { IPlatform } from './platform.interface';
import { IReview } from './review.interface';
import { ICompany } from './company.interface';

export enum GameGenre {
  Action = 'Action',
  Adventure = 'Adventure',
  RPG = 'RPG',
  FPS = 'FPS',
  Strategy = 'Strategy',
  Puzzle = 'Puzzle',
  Simulation = 'Simulation',
  Other = 'Other',
}


export interface IGame {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  genre: string[];
  platform: IPlatform[]; // not just Id[]
  createdBy: ICompany;   // not just Id
  reviews?: IReview[];   // not just Id[]
}

export type ICreateGame = Pick<
  IGame,
  'title' | 'description' | 'genre' | 'platform' | 'releaseDate' | 'createdBy' | 'reviews'
>;

export type IUpdateGame = Partial<Omit<IGame, 'id'>>;

export type IUpsertGame = IGame;
