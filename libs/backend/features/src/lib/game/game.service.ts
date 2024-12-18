import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IGame, Id, ICompany, IPlatform } from '@game-platform/shared/api';
import { CreateGameDto, UpdateGameDto } from '@game-platform/backend/dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectModel('Game') private readonly gameModel: Model<IGame>,
    @InjectModel('Company') private readonly companyModel: Model<ICompany>,
    @InjectModel('Platform') private readonly platformModel: Model<IPlatform>
  ) {}

  // Convert Mongoose document to IGame
  private toIGame(game: any): IGame {
    const gameObject = game.toObject();
    return {
      ...gameObject,
      id: gameObject._id.toHexString(),
    };
  }

  /**
   * Create a new game
   */
  async create(createGameDto: CreateGameDto): Promise<string> {
    try {
      const newGame = new this.gameModel(createGameDto);
      const savedGame = await newGame.save();

      // Update the referenced company's gamesCreated array
      await this.companyModel.findByIdAndUpdate(
        createGameDto.createdBy,
        { $push: { gamesCreated: savedGame._id } },
        { new: true }
      );

      // Update the referenced platforms' games array
      await this.platformModel.updateMany(
        { _id: { $in: createGameDto.platform } },
        { $push: { games: savedGame._id } },
        { new: true }
      );

      return savedGame._id.toHexString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create game.');
    }
  }

  /**
   * Retrieve all games
   */
  async getAll(): Promise<IGame[]> {
    try {
      const games = await this.gameModel
        .find()
        .populate('platform')
        .populate('createdBy')
        .populate('reviews')
        .exec();

      return games.map(this.toIGame);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to retrieve games.');
    }
  }

  /**
   * Retrieve a single game by ID
   */
  async getOne(id: string): Promise<IGame> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format.');
      }

      const game = await this.gameModel
        .findById(id)
        .populate('platform')
        .populate('createdBy')
        .populate('reviews')
        .exec();

      if (!game) {
        throw new NotFoundException(`Game with ID ${id} not found.`);
      }

      return this.toIGame(game);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to retrieve game with ID ${id}.`);
    }
  }

  /**
   * Update a game by ID
   */
  async update(id: string, updateGameDto: UpdateGameDto): Promise<string> {
    try {
      const game = await this.gameModel.findById(id).exec();
      if (!game) {
        throw new NotFoundException(`Game with ID ${id} not found.`);
      }

      const updatedGame = await this.gameModel
        .findByIdAndUpdate(id, updateGameDto, { new: true })
        .exec();

      if (!updatedGame) {
        throw new NotFoundException(`Failed to update game with ID ${id}.`);
      }

      // Update company gamesCreated array if createdBy is changed
      if (
        updateGameDto.createdBy &&
        updateGameDto.createdBy !== game.createdBy.toString()
      ) {
        await this.companyModel.findByIdAndUpdate(
          game.createdBy,
          { $pull: { gamesCreated: id } } // Remove from old company
        );
        await this.companyModel.findByIdAndUpdate(
          updateGameDto.createdBy,
          { $push: { gamesCreated: id } } // Add to new company
        );
      }

      // Update platforms if platform is changed
      if (updateGameDto.platform) {
        await this.platformModel.updateMany(
          { _id: { $in: game.platform } },
          { $pull: { games: id } } // Remove from old platforms
        );
        await this.platformModel.updateMany(
          { _id: { $in: updateGameDto.platform } },
          { $push: { games: id } } // Add to new platforms
        );
      }

      return updatedGame._id.toHexString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to update game with ID ${id}.`);
    }
  }

  /**
   * Delete a game by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const game = await this.gameModel.findById(id).exec();
      if (!game) {
        throw new NotFoundException(`Game with ID ${id} not found.`);
      }

      // Remove the game reference from related company and platforms
      await this.companyModel.findByIdAndUpdate(game.createdBy, {
        $pull: { gamesCreated: id },
      });
      await this.platformModel.updateMany(
        { _id: { $in: game.platform } },
        { $pull: { games: id } }
      );

      await this.gameModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to delete game with ID ${id}.`);
    }
  }

  /**
   * Add a platform to a game
   */
  async addPlatform(gameId: string, platformId: string): Promise<IGame> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found.`);
    }
    if (!game.platform.includes(platformId)) {
      game.platform.push(platformId);
      await game.save();
    }
    return this.toIGame(game);
  }

  /**
   * Remove a platform from a game
   */
  async removePlatform(gameId: string, platformId: string): Promise<IGame> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found.`);
    }
    game.platform = game.platform.filter((id) => id.toString() !== platformId);
    await game.save();
    return this.toIGame(game);
  }
}
