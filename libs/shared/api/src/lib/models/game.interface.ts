import { Types } from 'mongoose';

export enum GameGenre {
  Action = 'Action',
  Adventure = 'Adventure',
  RPG = 'RPG',
  FPS = 'FPS',
  Strategy = 'Strategy',
  Puzzle = 'Puzzle',
  Other = 'Other',
}

// Embedded Review inside Game
export interface IEmbeddedReview {
  userId: Types.ObjectId; // Reference to User
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IGame {
  id: string;
  title: string;
  description: string;
  genre: GameGenre;
  platform: Types.ObjectId; // Reference to Platform collection
  releaseDate: Date;
  createdBy: Types.ObjectId; // Reference to User collection
  reviews: IEmbeddedReview[]; // Embedded reviews
}

export type ICreateGame = Pick<
  IGame,
  'title' | 'description' | 'genre' | 'platform' | 'releaseDate' | 'createdBy'
>;

export type IUpdateGame = Partial<Omit<IGame, 'id'>>;

export type IUpsertGame = IGame;
