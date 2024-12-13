import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsDate,
    IsOptional,
  } from 'class-validator';
  import { ICreateGame, IUpdateGame, GameGenre } from '@game-platform/shared/api';
  
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
    @IsNotEmpty()
    releaseDate!: Date;
  
    @IsString()
    @IsNotEmpty()
    createdBy!: string;
  }
  
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
    @IsOptional()
    releaseDate?: Date;
  }
  