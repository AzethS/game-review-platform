import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import {
  ContactInformation,
  ICreateCompany,
  IUpdateCompany,
  IUpsertCompany,
} from '@game-platform/shared/api';

export class CreateCompanyDto implements ICreateCompany {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  contactInformation!: ContactInformation;

  @IsArray()
  @IsMongoId({ each: true })
  gamesCreated: string[] = []; // Add games
}

export class UpdateCompanyDto implements IUpdateCompany {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contactInformation?: ContactInformation;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  gamesCreated?: string[] = [];
}

export class UpsertCompanyDto implements IUpsertCompany {
  @IsOptional()
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  location!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsString()
  @IsOptional()
  contactInformation!: ContactInformation;

  @IsArray()
  @IsMongoId({ each: true })
  gamesCreated!: string[]; // Add games
}
