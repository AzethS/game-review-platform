// libs/shared/dto/src/lib/company.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  ContactInformation,
  ICreateCompany,
  IUpdateCompany,
  IUpsertCompany,
} from '@game-platform/shared/api';

import { GameRefDto } from './game.dto';

// Minimal Ref DTO
export class CompanyRefDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class CreateCompanyDto{
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  contactInformation!: ContactInformation;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameRefDto)
  gamesCreated: GameRefDto[] = [];
}

export class UpdateCompanyDto{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  contactInformation?: ContactInformation;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameRefDto)
  gamesCreated?: GameRefDto[];
}

export class UpsertCompanyDto{
  @IsOptional()
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  contactInformation!: ContactInformation;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameRefDto)
  gamesCreated!: GameRefDto[];
}
