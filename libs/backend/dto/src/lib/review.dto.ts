import { IsNotEmpty, IsString, IsNumber, IsOptional, Max, Min, IsMongoId } from 'class-validator';
import { ICreateReview, IUpdateReview } from '@game-platform/shared/api';



export class CreateReviewDto implements ICreateReview {
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsMongoId()
  @IsNotEmpty()
  gameId!: string;

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
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsMongoId()
  @IsNotEmpty()
  gameId!: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
