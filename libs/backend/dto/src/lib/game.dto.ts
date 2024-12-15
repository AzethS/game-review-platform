import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICreateGame, IUpdateGame, GameGenre } from '@game-platform/shared/api';
import { Types } from 'mongoose'; // Import Types for ObjectId

/**
 * DTO for creating a new game
 */
export class CreateGameDto implements ICreateGame {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(GameGenre)
  @IsNotEmpty()
  genre!: GameGenre;

  @IsMongoId()
  @IsNotEmpty()
  platform!: Types.ObjectId; // Reference to Platform

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  releaseDate!: Date;

  @IsMongoId()
  @IsNotEmpty()
  createdBy!: Types.ObjectId; // Reference to User
}

/**
 * DTO for updating an existing game
 */
export class UpdateGameDto implements IUpdateGame {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(GameGenre)
  @IsOptional()
  genre?: GameGenre;

  @IsMongoId()
  @IsOptional()
  platform?: Types.ObjectId; // Reference to Platform

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  releaseDate?: Date;

  @IsMongoId()
  @IsOptional()
  createdBy?: Types.ObjectId; // Reference to User
}
