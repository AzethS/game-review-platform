import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Platform, PlatformDocument } from './platforms.schema';
import {
  CreatePlatformDto,
  UpdatePlatformDto,
} from '@game-platform/backend/dto';
import { IPlatform } from '@game-platform/shared/api';
import { Game, GameDocument } from '../game/game.schema';

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  constructor(
    @InjectModel(Platform.name) private platformModel: Model<PlatformDocument>,
    @InjectModel(Game.name) private gameModel: Model<GameDocument> // Inject game model
  ) {}

  /**
   * Convert Mongoose document to IPlatform
   */
  private toIPlatform(platform: PlatformDocument): IPlatform {
    return {
      id: platform.id || platform.id?.toHexString() || '', // Virtual `id`
      name: platform.name,
      description: platform.description,
      games: platform.games,
    };
  }

  /**
   * Retrieve all platforms.
   */
  async getAll(): Promise<IPlatform[]> {
    this.logger.log('Fetching all platforms');
    const platforms = await this.platformModel.find().exec();
    return platforms.map(this.toIPlatform); // Map documents to IPlatform
  }

  /**
   * Retrieve a single platform by ID.
   */
  async getOne(id: string): Promise<IPlatform> {
    this.logger.log(`Fetching platform with ID: ${id}`);
    const platform = await this.platformModel.findById(id).exec();
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }
    return this.toIPlatform(platform);
  }

  /**
   * Create a new platform.
   */
  async create(createPlatformDto: CreatePlatformDto): Promise<IPlatform> {
    this.logger.log('Creating a new platform');
    const newPlatform = new this.platformModel(createPlatformDto);
    const savedPlatform = await newPlatform.save();
    return this.toIPlatform(savedPlatform);
  }

  /**
   * Update a platform by ID.
   */
  async update(
    id: string,
    updatePlatformDto: UpdatePlatformDto
  ): Promise<IPlatform> {
    this.logger.log(`Updating platform with ID: ${id}`);
    const updatedPlatform = await this.platformModel
      .findByIdAndUpdate(id, updatePlatformDto, { new: true })
      .exec();
    if (!updatedPlatform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }
    return this.toIPlatform(updatedPlatform);
  }

  /**
   * Delete a platform by ID.
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting platform with ID: ${id}`);
    const result = await this.platformModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }
  }

  /**
   * Link a game to a platform.
   */
  async addGameToPlatform(platformId: string, gameId: string): Promise<void> {
    await this.platformModel
      .findByIdAndUpdate(
        platformId,
        { $addToSet: { games: gameId } } // Prevent duplicates
      )
      .exec();

    await this.gameModel
      .findByIdAndUpdate(
        gameId,
        { $addToSet: { platforms: platformId } } // Prevent duplicates
      )
      .exec();
  }

  /**
   * Unlink a game from a platform.
   */
  async removeGameFromPlatform(
    platformId: string,
    gameId: string
  ): Promise<void> {
    await this.platformModel
      .findByIdAndUpdate(platformId, { $pull: { games: gameId } })
      .exec();

    await this.gameModel
      .findByIdAndUpdate(gameId, { $pull: { platforms: platformId } })
      .exec();
  }
}
