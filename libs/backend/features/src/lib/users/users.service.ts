import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUser, Id, IReview, IGame } from '@game-platform/shared/api';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '@game-platform/backend/dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Review') private readonly reviewModel: Model<IReview>,
    @InjectModel('Game') private readonly gameModel: Model<IGame>,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const userToSave = {
        ...createUserDto,
        password: hashedPassword,
      };

      const createdUser = new this.userModel(userToSave);
      const user = await createdUser.save();
      return user.id as string;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async validateUser(email: string, pass: string): Promise<string | null> {
    try {
      const user = await this.userModel.findOne({ emailAddress: email }).exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.id,
        username: user.emailAddress,
        name: user.name,
        role: user.role,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      return accessToken;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async changePassword(
    userId: Id,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const isPasswordMatching = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatching) {
        throw new BadRequestException('Current password is incorrect');
      }

      const hashedNewPassword = await this.hashPassword(newPassword);
      user.password = hashedNewPassword;
      await user.save();

      return true;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      const users = await this.userModel.find().exec();
      return users.map((user) => this.toIUser(user));
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getOne(id: Id): Promise<IUser> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return this.toIUser(user);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getOneByEmail(email: string): Promise<IUser> {
    try {
      const user = await this.userModel.findOne({ emailAddress: email }).exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return this.toIUser(user);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(
          `User with ID ${id} not found during update`
        );
      }

      // Update `reviewsGiven` references if necessary
      if (updateUserDto.reviewsGiven !== undefined) {
        await this.updateUserReferences(
          id,
          user.reviewsGiven || [],
          updateUserDto.reviewsGiven,
          this.reviewModel,
          'reviewsGiven'
        );
      }

      // Update `ownedGames` references if necessary
      if (updateUserDto.ownedGames !== undefined) {
        await this.updateUserReferences(
          id,
          user.ownedGames || [],
          updateUserDto.ownedGames,
          this.gameModel,
          'ownedGames'
        );
      }

      return updatedUser.id as string;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getAllMembers(): Promise<IUser[]> {
    try {
      const members = await this.userModel.find({ role: 'Member' }).exec();
      return members.map((member) => this.toIUser(member));
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private toIUser(user: any): IUser {
    const userObject = user.toObject();
    userObject.id = userObject._id?.toHexString();
    delete userObject._id;
    delete userObject.password;
    return userObject as IUser;
  }

  private async updateUserReferences(
    userId: Id,
    currentRefs: Id[],
    newRefs: Id[],
    model: Model<any>,
    fieldName: string
  ): Promise<void> {
    // Remove old references
    const toRemove = currentRefs.filter(
      (id) => !newRefs.includes(id.toString())
    );
    if (toRemove.length > 0) {
      await model.updateMany(
        { _id: { $in: toRemove } },
        { $pull: { [fieldName]: userId } }
      );
    }

    // Add new references
    const toAdd = newRefs.filter((id) => !currentRefs.includes(id.toString()));
    if (toAdd.length > 0) {
      await model.updateMany(
        { _id: { $in: toAdd } },
        { $push: { [fieldName]: userId } }
      );
    }
  }
}
