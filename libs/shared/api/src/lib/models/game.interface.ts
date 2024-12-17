import { Id } from './id.type';

export enum GameGenre {
  Action = 'Action',
  Adventure = 'Adventure',
  RPG = 'RPG',
  FPS = 'FPS',
  Strategy = 'Strategy',
  Puzzle = 'Puzzle',
  Other = 'Other',
}

type Platform = Id;
type Review = Id;
type Company = Id;

export interface IGame {
  id: string;
  title: string;
  description: string;
  genre: GameGenre[];
  platform: Platform[]; // Reference to Platform collection
  releaseDate: Date;
  createdBy: Company; // Reference to Company collection
  reviews: Review[]; // Reference to reviews
}

export type ICreateGame = Pick<
  IGame,
  'title' | 'description' | 'genre' | 'platform' | 'releaseDate' | 'createdBy' | 'reviews'
>;

export type IUpdateGame = Partial<Omit<IGame, 'id'>>;

export type IUpsertGame = IGame;
