import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto, UpdateUserDto } from '@game-platform/backend/dto';
import { IUser } from '@game-platform/shared/api';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private toIUser(user: UserDocument): IUser {
    return {
      id: user.id || user._id?.toHexString() || '', // Fallback for id
      username: user.username,
      email: user.email,
      password: user.password,
      games: user.games.map((game) => game.toString()), // Convert ObjectId to string

    };
  }
  async getAll(): Promise<IUser[]> {
    const users = await this.userModel.find().populate('games').exec(); // Populate games
    return users.map(this.toIUser);
  }

  async getOne(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).populate('games').exec(); // Populate games
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toIUser(user);
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(createUserDto);
    const savedUser = await newUser.save();
    return this.toIUser(savedUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('games')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toIUser(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
