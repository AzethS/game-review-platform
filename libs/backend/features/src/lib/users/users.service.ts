import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { IUser, Id, IReview, IGame } from '@game-platform/shared/api';
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
    private jwtService: JwtService,
  ) {}

  /**
   * Create a new user.
   */
  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const userToSave = { ...createUserDto, password: hashedPassword };

      const createdUser = new this.userModel(userToSave);
      const user = await createdUser.save();
      return user.id as string;
    } catch (error) {
      this.handleError(error, 'Failed to create user');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  /**
   * Validate user credentials.
   */
  async validateUser(email: string, pass: string): Promise<string | null> {
    try {
      const user = await this.userModel
        .findOne({ emailAddress: email })
        .select('+password')
        .exec();

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException('Invalid credentials');
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
      this.handleError(error, 'Validation failed');
    }
  }

  /**
   * Change a user's password.
   */
  async changePassword(userId: Id, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(userId).select('+password').exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const isPasswordMatching = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatching) {
        throw new BadRequestException('Current password is incorrect');
      }

      user.password = await this.hashPassword(newPassword);
      await user.save();

      return true;
    } catch (error) {
      this.handleError(error, 'Password change failed');
    }
  }

  /**
   * Retrieve all users.
   */
  async getAll(): Promise<IUser[]> {
    try {
      const users = await this.userModel
        .find()
        .populate('reviewsGiven')
        .populate('ownedGames')
        .exec();
      return users.map((user) => this.toIUser(user));
    } catch (error) {
      this.handleError(error, 'Failed to retrieve users');
    }
  }

  /**
   * Retrieve all members.
   */
  async getAllMembers(): Promise<IUser[]> {
    try {
      const members = await this.userModel
        .find({ role: 'Member' })
        .populate('reviewsGiven')
        .populate('ownedGames')
        .exec();
      return members.map((member) => this.toIUser(member));
    } catch (error) {
      this.handleError(error, 'Failed to retrieve members');
    }
  }

  /**
   * Retrieve a single user by ID.
   */
  async getOne(id: Id): Promise<IUser> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const user = await this.userModel
        .findById(id)
        .populate('reviewsGiven')
        .populate('ownedGames')
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return this.toIUser(user);
    } catch (error) {
      this.handleError(error, 'Failed to retrieve user');
    }
  }

  /**
   * Retrieve a user by email address.
   */
  async getOneByEmail(email: string, includePassword = false): Promise<IUser> {
    try {
      const query = this.userModel.findOne({ emailAddress: email });
      if (includePassword) {
        query.select('+password'); // Explicitly include the password field
      }
  
      const user = await query.exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
  
      return this.toIUser(user, includePassword);
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : 'Unknown error', UserService.name);
      throw new BadRequestException('Failed to fetch user');
    }
  }
  

  /**
   * Update user information.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found during update`);
      }

      if (updateUserDto.reviewsGiven) {
        await this.updateUserReferences(
          id,
          user.reviewsGiven || [],
          updateUserDto.reviewsGiven,
          this.reviewModel,
          'reviewsGiven',
        );
      }

      if (updateUserDto.ownedGames) {
        await this.updateUserReferences(
          id,
          user.ownedGames || [],
          updateUserDto.ownedGames,
          this.gameModel,
          'ownedGames',
        );
      }

      return updatedUser.id as string;
    } catch (error) {
      this.handleError(error, 'Update failed');
    }
  }

  /**
   * Delete a user by ID.
   */
  async delete(id: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      this.handleError(error, 'Delete failed');
    }
  }

  /**
   * Helper function to transform Mongoose document into IUser.
   */
  private toIUser(user: any, includePassword = false): IUser {
    const userObject = user.toObject();
    userObject.id = userObject._id?.toHexString();
    delete userObject._id;

    if (!includePassword) {
      delete userObject.password;
    }

    return userObject as IUser;
  }

  /**
   * Update references for related fields.
   */
  private async updateUserReferences(
    userId: Id,
    currentRefs: Id[],
    newRefs: Id[],
    model: Model<any>,
    fieldName: string,
  ): Promise<void> {
    const toRemove = currentRefs.filter((id) => !newRefs.includes(id.toString()));
    const toAdd = newRefs.filter((id) => !currentRefs.includes(id.toString()));

    if (toRemove.length > 0) {
      await model.updateMany(
        { _id: { $in: toRemove } },
        { $pull: { [fieldName]: userId } },
      );
    }

    if (toAdd.length > 0) {
      await model.updateMany(
        { _id: { $in: toAdd } },
        { $push: { [fieldName]: userId } },
      );
    }
  }

  /**
   * General error handling method.
   */
  private handleError(error: unknown, defaultMessage: string): never {
    if (error instanceof Error) {
      this.logger.error(error.message || defaultMessage, UserService.name);
      throw new BadRequestException(error.message || defaultMessage);
    } else {
      this.logger.error(defaultMessage, UserService.name);
      throw new BadRequestException(defaultMessage);
    }
  }
}
