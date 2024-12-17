import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ICreateGame,
  IUpdateGame,
  IUpsertGame,
  GameGenre,
} from '@game-platform/shared/api';

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
  genre!: GameGenre[];

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  platform!: string[]; // Reference to Platform

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  releaseDate!: Date;

  @IsMongoId()
  @IsNotEmpty()
  createdBy!: string; // Reference to Company

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  reviews!: string[]; // Reference to reviews
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
  @IsArray()
  genre?: GameGenre[];

  @IsMongoId()
  @IsOptional()
  platform?: string[]; // Reference to Platform

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  releaseDate?: Date;

  @IsMongoId()
  @IsOptional()
  createdBy?: string; // Reference to Company
}
export class UpsertGameDto implements IUpsertGame {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(GameGenre)
  @IsNotEmpty()
  genre!: GameGenre[];

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  platform!: string[]; // Reference to Platform

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  releaseDate!: Date;

  @IsMongoId()
  @IsNotEmpty()
  createdBy!: string; // Reference to Company

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  reviews!: string[]; // Reference to reviews
}
