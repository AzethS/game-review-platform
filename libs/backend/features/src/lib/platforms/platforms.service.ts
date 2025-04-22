import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IPlatform, IGame } from '@game-platform/shared/api';
import {
  CreatePlatformDto,
  UpdatePlatformDto,
} from '@game-platform/backend/dto';

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  constructor(
    @InjectModel('Platform') private readonly platformModel: Model<IPlatform>,
    @InjectModel('Game') private readonly gameModel: Model<IGame>
  ) {}

  private toIPlatform(platform: any): IPlatform {
    const obj = platform.toObject();
    return {
      ...obj,
      id: obj._id.toHexString(),
    };
  }

  async create(createPlatformDto: CreatePlatformDto): Promise<string> {
    try {
      const newPlatform = new this.platformModel(createPlatformDto);
      const savedPlatform = await newPlatform.save();

      const gameIds = createPlatformDto.games.map((g) =>
        typeof g === 'string' ? g : g.id
      );
      await this.gameModel.updateMany(
        { _id: { $in: gameIds } },
        { $push: { platform: savedPlatform._id } },
        { multi: true }
      );

      return savedPlatform._id.toHexString();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Create failed'
      );
    }
  }

  async getAll(): Promise<IPlatform[]> {
    try {
      const platforms = await this.platformModel
        .find()
        .populate('games')
        .exec();
      return platforms.map(this.toIPlatform);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Retrieve failed'
      );
    }
  }

  async getOne(id: string): Promise<IPlatform> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format.');
    }
    const platform = await this.platformModel
      .findById(id)
      .populate('games')
      .exec();
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found.`);
    }
    return this.toIPlatform(platform);
  }

  async update(
    id: string,
    updatePlatformDto: UpdatePlatformDto
  ): Promise<string> {
    try {
      const platform = await this.platformModel.findById(id).exec();
      if (!platform) {
        throw new NotFoundException(`Platform with ID ${id} not found.`);
      }

      const updatedPlatform = await this.platformModel
        .findByIdAndUpdate(id, updatePlatformDto, { new: true })
        .exec();

      if (!updatedPlatform) {
        throw new NotFoundException(`Failed to update platform with ID ${id}.`);
      }

      if (updatePlatformDto.games) {
        const newGameIds = updatePlatformDto.games.map((g) =>
          typeof g === 'string' ? g : g.id
        );

        await this.gameModel.updateMany(
          { _id: { $in: platform.games } },
          { $pull: { platform: id } },
          { multi: true }
        );

        await this.gameModel.updateMany(
          { _id: { $in: newGameIds } },
          { $push: { platform: id } },
          { multi: true }
        );
      }

      return updatedPlatform._id.toHexString();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Update failed'
      );
    }
  }

  async delete(id: string): Promise<void> {
    const platform = await this.platformModel.findById(id).exec();
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found.`);
    }

    await this.gameModel.updateMany(
      { _id: { $in: platform.games } },
      { $pull: { platform: id } },
      { multi: true }
    );

    await this.platformModel.findByIdAndDelete(id).exec();
  }

  async addGame(platformId: string, gameId: string): Promise<IPlatform> {
    const platform = await this.platformModel.findById(platformId).exec();
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${platformId} not found.`);
    }
  
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found.`);
    }
  
    const gameExists = (platform.games || []).some(
      (g) => (typeof g === 'string' ? g === gameId : g.id === gameId)
    );
  
    if (!gameExists) {
      platform.games = [...(platform.games || []), game];
      await platform.save();
    }
  
    return this.toIPlatform(await platform.populate('games'));
  }
  
  async removeGame(platformId: string, gameId: string): Promise<IPlatform> {
    const platform = await this.platformModel.findById(platformId).exec();
    if (!platform) {
      throw new NotFoundException(`Platform with ID ${platformId} not found.`);
    }

    // Filter using string comparison
    platform.games = (platform.games || []).filter(
      (g) => (typeof g === 'string' ? g : g.id) !== gameId
    );

    await platform.save();
    return this.toIPlatform(await platform.populate('games'));
  }
}
