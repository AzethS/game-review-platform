import { Id } from './id.type';
import { IUser } from './user.interface';
import { IGame } from './game.interface';

export interface IReview {
  id: Id;
  comment: string;
  rating: number;
  userId: IUser;
  gameId: IGame;
}

export interface IPopulatedReview extends IReview {
  userName: string;
  gameTitle: string;
}

export type ICreateReview = Pick<IReview, 'userId' | 'gameId' | 'rating' | 'comment'>;
export type IUpdateReview = Partial<Omit<IReview, 'id'>>;
export type IUpsertReview = IReview;
