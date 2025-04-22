import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GameGenre } from '@game-platform/shared/api';
import { PlatformRefDto } from './platform.dto';
import { CompanyRefDto } from './company.dto';
import { ReviewRefDto } from './review.dto';

/**
 * Reference DTO for Game
 */
export class GameRefDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO for creating a new game
 */
export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsEnum(GameGenre, { each: true })
  genre!: GameGenre[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformRefDto)
  platform!: PlatformRefDto[];

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  releaseDate!: Date;

  @ValidateNested()
  @Type(() => CompanyRefDto)
  @IsNotEmpty()
  createdBy!: CompanyRefDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewRefDto)
  reviews?: ReviewRefDto[];
}

/**
 * DTO for updating a game
 */
export class UpdateGameDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(GameGenre, { each: true })
  genre?: GameGenre[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformRefDto)
  platform?: PlatformRefDto[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyRefDto)
  createdBy?: CompanyRefDto;
}

/**
 * DTO for upserting a game
 */
export class UpsertGameDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsEnum(GameGenre, { each: true })
  genre!: GameGenre[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformRefDto)
  platform!: PlatformRefDto[];

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  releaseDate!: Date;

  @ValidateNested()
  @Type(() => CompanyRefDto)
  @IsNotEmpty()
  createdBy!: CompanyRefDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewRefDto)
  reviews?: ReviewRefDto[];
}
