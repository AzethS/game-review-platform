import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsEmail,
  IsArray,
  IsOptional,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Role,
  ICreateUser,
  IUpdateUser,
  IUpsertUser,
  Address,
} from '@game-platform/shared/api';

class AddressDto implements Address {
  @IsNotEmpty()
  @IsString()
  street!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  zipCode!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;
}

export class CreateUserDto implements ICreateUser {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  emailAddress!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsDate()
  birthDate!: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsNotEmpty()
  @IsString()
  role!: Role;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  ownedGames: string[] = [];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  reviewsGiven: string[] = [];
}

export class UpdateUserDto implements IUpdateUser {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  emailAddress?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsString()
  @IsOptional()
  role?: Role;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  ownedGames?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  reviewsGiven?: string[];
}

export class UpsertUserDto implements IUpsertUser {
  // Assuming 'id' is a string representation of MongoDB's ObjectId
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  emailAddress!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsDate()
  birthDate!: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsNotEmpty()
  @IsString()
  role!: Role;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  ownedGames?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  reviewsGiven?: string[];
  
}

export class ValidateUserDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
