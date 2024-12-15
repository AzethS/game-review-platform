import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICreateGame, IUpdateGame, GameGenre } from '@game-platform/shared/api';

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

  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsDate()
  @Type(() => Date) // Converts incoming string to Date object
  @IsNotEmpty()
  releaseDate!: Date;

  @IsString()
  @IsNotEmpty()
  createdBy!: string;
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

  @IsString()
  @IsOptional()
  platform?: string;

  @IsDate()
  @Type(() => Date) // Converts incoming string to Date object
  @IsOptional()
  releaseDate?: Date;
}
