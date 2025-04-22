import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IGame, ICompany, IPlatform } from '@game-platform/shared/api';
import { CreateGameDto, UpdateGameDto } from '@game-platform/backend/dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectModel('Game') private readonly gameModel: Model<IGame>,
    @InjectModel('Company') private readonly companyModel: Model<ICompany>,
    @InjectModel('Platform') private readonly platformModel: Model<IPlatform>
  ) {}
  private toIGame(game: any): IGame {
    const gameObject = game.toObject();

    // Convert nested IDs properly
    const reviews =
      gameObject.reviews?.map((review: any) => ({
        ...review,
        id: review._id?.toString(),
        userId:
          review.userId && typeof review.userId === 'object'
            ? {
                id: review.userId._id?.toString(),
                name: review.userId.name,
              }
            : review.userId,
      })) ?? [];

    return {
      ...gameObject,
      id: gameObject._id?.toString(),
      reviews,
    };
  }

  async create(createGameDto: CreateGameDto): Promise<string> {
    try {
      const gameDoc = {
        ...createGameDto,
        createdBy: createGameDto.createdBy.id,
        platform: createGameDto.platform.map((p) => p.id),
      };

      const newGame = new this.gameModel(gameDoc);
      const savedGame = await newGame.save();

      await this.companyModel.findByIdAndUpdate(
        gameDoc.createdBy,
        { $push: { gamesCreated: savedGame._id } },
        { new: true }
      );

      await this.platformModel.updateMany(
        { _id: { $in: gameDoc.platform } },
        { $push: { games: savedGame._id } },
        { new: true }
      );

      return savedGame._id.toHexString();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create game'
      );
    }
  }

  async getAll(): Promise<IGame[]> {
    try {
      const games = await this.gameModel
        .find()
        .populate('platform')
        .populate('createdBy')
        .populate({ path: 'reviews', populate: { path: 'userId' } })
        .exec();

      return games.map(this.toIGame);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to retrieve games'
      );
    }
  }

  async getOne(id: string): Promise<IGame> {
    const game = await this.gameModel
      .findById(id)
      .populate('platform')
      .populate('createdBy')
      .populate({ path: 'reviews', populate: { path: 'userId' } })
      .exec();

    if (!game) throw new NotFoundException('Game not found');
    return this.toIGame(game);
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<string> {
    try {
      const existingGame = await this.gameModel.findById(id).exec();
      if (!existingGame)
        throw new NotFoundException(`Game with ID ${id} not found`);

      const newCompanyId = updateGameDto.createdBy?.id;
      const newPlatformIds = updateGameDto.platform?.map((p) => p.id);

      const updatedGame = await this.gameModel
        .findByIdAndUpdate(
          id,
          {
            ...updateGameDto,
            createdBy: newCompanyId ?? existingGame.createdBy,
            platform: newPlatformIds ?? existingGame.platform,
          },
          { new: true }
        )
        .exec();

      if (!updatedGame)
        throw new NotFoundException(`Failed to update game with ID ${id}`);

      if (newCompanyId && newCompanyId !== existingGame.createdBy.toString()) {
        await this.companyModel.findByIdAndUpdate(existingGame.createdBy, {
          $pull: { gamesCreated: id },
        });
        await this.companyModel.findByIdAndUpdate(newCompanyId, {
          $push: { gamesCreated: id },
        });
      }

      if (newPlatformIds) {
        const oldPlatformIds = (existingGame.platform || []).map((p) =>
          p.toString()
        );
        await this.platformModel.updateMany(
          { _id: { $in: oldPlatformIds } },
          { $pull: { games: id } }
        );
        await this.platformModel.updateMany(
          { _id: { $in: newPlatformIds } },
          { $addToSet: { games: id } }
        );
      }

      return updatedGame._id.toHexString();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update game'
      );
    }
  }

  async delete(id: string): Promise<void> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) throw new NotFoundException(`Game with ID ${id} not found`);

    await this.companyModel.findByIdAndUpdate(game.createdBy, {
      $pull: { gamesCreated: id },
    });
    await this.platformModel.updateMany(
      { _id: { $in: game.platform } },
      { $pull: { games: id } }
    );

    await this.gameModel.findByIdAndDelete(id).exec();
  }

  async addPlatform(gameId: string, platformId: string): Promise<IGame> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    const currentIds = (game.platform || []).map((p) =>
      typeof p === 'string' ? p : p.id
    );
    if (!currentIds.includes(platformId)) {
      (game.platform as (string | IPlatform)[]).push(platformId);
      await game.save();
    }

    return this.toIGame(await game.populate('platform'));
  }

  async removePlatform(gameId: string, platformId: string): Promise<IGame> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) throw new NotFoundException(`Game with ID ${gameId} not found`);

    game.platform = game.platform.filter(
      (p) => (typeof p === 'string' ? p : p.id) !== platformId
    );
    await game.save();

    return this.toIGame(await game.populate('platform'));
  }
}
