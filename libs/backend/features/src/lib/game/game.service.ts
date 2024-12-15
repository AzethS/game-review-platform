import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './game.schema';
import { CreateGameDto } from '@game-platform/backend/dto';

@Injectable()
export class GameService {
  private readonly TAG = 'GameService';
  private readonly logger = new Logger(this.TAG);

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  /**
   * Retrieve all games.
   */
  async getAll(): Promise<Game[]> {
    this.logger.log('Fetching all games');
    return this.gameModel.find().exec();
  }

  /**
   * Retrieve a single game by ID.
   */
  async getOne(id: string): Promise<Game> {
    this.logger.log(`Fetching game with ID: ${id}`);
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  /**
   * Create a new game.
   */
  async create(createGameDto: CreateGameDto): Promise<Game> {
    this.logger.log('Creating a new game');
    const newGame = new this.gameModel(createGameDto);
    return newGame.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.gameModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Game with ID ${id} not found.`);
    }
  }
}
