import { Types } from 'mongoose';

export interface IReview {
  id: string;
  userId: Types.ObjectId; // Reference to User collection
  gameId: Types.ObjectId; // Reference to Game collection
  rating: number; // Between 0 and 5
  comment?: string; // Optional comment
  createdAt: Date;
}

// CRUD utility types
export type ICreateReview = Pick<IReview, 'userId' | 'gameId' | 'rating' | 'comment'>;

export type IUpdateReview = Partial<Omit<IReview, 'id'>>;

export type IUpsertReview = IReview;
