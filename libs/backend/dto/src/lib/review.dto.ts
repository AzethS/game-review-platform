import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICreateReview, IUpdateReview } from '@game-platform/shared/api';
import { GameRefDto } from './game.dto';
import { UserRefDto } from './user.dto';

// Reference DTOs

export class ReviewRefDto{
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  comment!: string;

  @IsNotEmpty()
  rating!: number;

  @ValidateNested()
  @Type(() => GameRefDto)
  gameId!: GameRefDto;

  @ValidateNested()
  @Type(() => UserRefDto)
  userId!: UserRefDto;
}

// Main DTOs

export class CreateReviewDto{
  @IsString()
  userId!: string;

  @IsString()
  gameId!: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto{
  @IsOptional()
  @ValidateNested()
  @Type(() => UserRefDto)
  userId?: UserRefDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GameRefDto)
  gameId?: GameRefDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
