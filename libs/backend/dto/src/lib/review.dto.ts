import { IsNotEmpty, IsString, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ICreateReview, IUpdateReview } from '@game-platform/shared/api';
import { Types } from 'mongoose';


export class CreateReviewDto implements ICreateReview {
  @IsString()
  @IsNotEmpty()
  userId!: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  gameId!: Types.ObjectId;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateReviewDto implements IUpdateReview {
  @IsString()
  @IsOptional()
  userId?: Types.ObjectId;

  @IsString()
  @IsOptional()
  gameId?: Types.ObjectId;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
