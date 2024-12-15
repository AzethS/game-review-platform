import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './game.schema';
import { User, UserDocument } from '../users/users.schema'; // Import User schema
import {
  CreateGameDto,
  UpdateGameDto,
  CreateReviewDto,
} from '@game-platform/backend/dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument> // Inject User model
  ) {}

  /**
   * Retrieve all games with populated references to Platform and User.
   */
  async getAll(): Promise<Game[]> {
    this.logger.log('Fetching all games with references');
    return this.gameModel
      .find()
      .populate('platform') // Populate Platform reference
      .populate('createdBy') // Populate User reference
      .exec();
  }

  /**
   * Retrieve a single game by ID with populated references.
   */
  async getOne(id: string): Promise<Game> {
    this.logger.log(`Fetching game with ID: ${id}`);
    const game = await this.gameModel
      .findById(id)
      .populate('platform') // Populate Platform reference
      .populate('createdBy') // Populate User reference
      .exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  /**
   * Create a new game with references to Platform and User.
   */
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const newGame = new this.gameModel(createGameDto);
    const savedGame = await newGame.save();

    // Add game to the user's games array
    await this.userModel.findByIdAndUpdate(
      createGameDto.createdBy,
      { $push: { games: savedGame._id } },
      { new: true }
    );

    return savedGame;
  }

  /**
   * Update an existing game.
   */
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    this.logger.log(`Updating game with ID: ${id}`);
    const updatedGame = await this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .populate('platform')
      .populate('createdBy')
      .exec();

    if (!updatedGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return updatedGame;
  }

  /**
   * Add a review to an existing game.
   */
  async addReview(id: string, reviewDto: CreateReviewDto): Promise<Game> {
    this.logger.log(`Adding review to game with ID: ${id}`);
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    // Push the review into the embedded reviews array
    game.reviews.push({
      userId: reviewDto.userId,
      rating: reviewDto.rating,
      comment: reviewDto.comment,
      createdAt: new Date(),
    });

    return game.save();
  }

  /**
   * Delete a game by ID.
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting game with ID: ${id}`);
    const result = await this.gameModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
  }
}
