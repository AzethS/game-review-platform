import { IsNotEmpty, IsString, IsOptional, IsEmail, IsMongoId } from 'class-validator';
import { ICreateUser, IUpdateUser } from '@game-platform/shared/api';

export class CreateUserDto implements ICreateUser {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsMongoId({ each: true }) // Ensures all entries are valid ObjectId strings
  @IsOptional()
  games?: string[];
}

export class UpdateUserDto implements IUpdateUser {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsMongoId({ each: true })
  @IsOptional()
  games?: string[];
}
