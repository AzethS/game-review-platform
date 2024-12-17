import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IPlatform, Id } from '@game-platform/shared/api';
import { CreatePlatformDto, UpdatePlatformDto } from '@game-platform/backend/dto';

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  constructor(
    @InjectModel('Platform') private readonly platformModel: Model<IPlatform>,
  ) {}

  // Convert Mongoose document to IPlatform
  private toIPlatform(platform: any): IPlatform {
    const platformObject = platform.toObject();
    return {
      ...platformObject,
      id: platformObject._id.toHexString(),
    };
  }

  /**
   * Create a new platform
   */
  async create(createPlatformDto: CreatePlatformDto): Promise<string> {
    try {
      const newPlatform = new this.platformModel(createPlatformDto);
      const savedPlatform = await newPlatform.save();
      return savedPlatform._id.toHexString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create platform.');
    }
  }

  /**
   * Retrieve all platforms
   */
  async getAll(): Promise<IPlatform[]> {
    try {
      const platforms = await this.platformModel.find().populate('games').exec();
      return platforms.map(this.toIPlatform);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to retrieve platforms.');
    }
  }

  /**
   * Retrieve a single platform by ID
   */
  async getOne(id: string): Promise<IPlatform> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format.');
      }

      const platform = await this.platformModel.findById(id).populate('games').exec();
      if (!platform) {
        throw new NotFoundException(`Platform with ID ${id} not found.`);
      }

      return this.toIPlatform(platform);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to retrieve platform with ID ${id}.`);
    }
  }

  /**
   * Update a platform by ID
   */
  async update(id: string, updatePlatformDto: UpdatePlatformDto): Promise<string> {
    try {
      const updatedPlatform = await this.platformModel
        .findByIdAndUpdate(id, updatePlatformDto, { new: true })
        .exec();

      if (!updatedPlatform) {
        throw new NotFoundException(`Platform with ID ${id} not found.`);
      }

      return updatedPlatform._id.toHexString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to update platform with ID ${id}.`);
    }
  }

  /**
   * Delete a platform by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const deletedPlatform = await this.platformModel.findByIdAndDelete(id).exec();
      if (!deletedPlatform) {
        throw new NotFoundException(`Platform with ID ${id} not found.`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to delete platform with ID ${id}.`);
    }
  }

  /**
   * Add a game to the platform
   */
  async addGame(platformId: Id, gameId: Id): Promise<IPlatform> {
    try {
      const platform = await this.platformModel.findById(platformId).exec();
      if (!platform) {
        throw new NotFoundException(`Platform with ID ${platformId} not found.`);
      }

      if (!platform.games.includes(gameId)) {
        platform.games.push(gameId);
      }
      await platform.save();
      return this.toIPlatform(platform);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to add game to platform.');
    }
  }

  /**
   * Remove a game from the platform
   */
  async removeGame(platformId: Id, gameId: Id): Promise<IPlatform> {
    try {
      const platform = await this.platformModel.findById(platformId).exec();
      if (!platform) {
        throw new NotFoundException(`Platform with ID ${platformId} not found.`);
      }

      platform.games = platform.games.filter((id) => id.toString() !== gameId);
      await platform.save();
      return this.toIPlatform(platform);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to remove game from platform.');
    }
  }
}
