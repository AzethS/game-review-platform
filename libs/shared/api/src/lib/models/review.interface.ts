import { Id } from './id.type';


type User = Id;
type Game = Id;

export interface IReview {
  id: string;
  userId: User; // Reference to User collection
  gameId: Game; // Reference to Game collection
  rating: number; // Between 0 and 5
  comment?: string; // Optional comment
  createdAt: Date;
}

// CRUD utility types
export type ICreateReview = Pick<IReview, 'userId' | 'gameId' | 'rating' | 'comment'>;

export type IUpdateReview = Partial<Omit<IReview, 'id'>>;

export type IUpsertReview = IReview;
