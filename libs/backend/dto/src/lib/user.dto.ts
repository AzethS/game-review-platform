import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsEmail,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Role,
  ICreateUser,
  IUpdateUser,
  IUpsertUser,
  Address,
  IGame,
  IReview,
} from '@game-platform/shared/api';
import { GameRefDto } from './game.dto';
import { ReviewRefDto } from './review.dto';

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

export class UserRefDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class CreateUserDto{
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
  @ValidateNested({ each: true })
  @Type(() => GameRefDto)
  ownedGames: GameRefDto[] = [];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewRefDto)
  reviewsGiven: ReviewRefDto[] = [];
}

export class UpdateUserDto{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsString()
  role?: Role;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameRefDto)
  ownedGames?: GameRefDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewRefDto)
  reviewsGiven?: ReviewRefDto[];
}

export class UpsertUserDto{
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
  @ValidateNested({ each: true })
  @Type(() => GameRefDto)
  ownedGames?: GameRefDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewRefDto)
  reviewsGiven?: ReviewRefDto[];
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
