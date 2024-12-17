import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import {
  ICreatePlatform,
  IUpdatePlatform,
  IUpsertPlatform,
} from '@game-platform/shared/api';

export class CreatePlatformDto implements ICreatePlatform {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  games: string[] = []; // Add games
}

export class UpdatePlatformDto implements IUpdatePlatform {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  games?: string[]; // Add/remove games
}

export class UpsertPlatformDto implements IUpsertPlatform {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  games!: string[]; // Add games
}
