import { IsNotEmpty, IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ICreatePlatform, IUpdatePlatform } from '@game-platform/shared/api';

export class CreatePlatformDto implements ICreatePlatform {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePlatformDto implements IUpdatePlatform {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsMongoId({ each: true })
  games?: string[]; // Add/remove games
}
