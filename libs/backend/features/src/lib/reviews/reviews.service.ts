import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './reviews.schema';
import { Game, GameDocument } from '../game/game.schema';
import { CreateReviewDto, UpdateReviewDto } from '@game-platform/backend/dto';
import { IReview } from '@game-platform/shared/api';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
  ) {}

  private toIReview(review: ReviewDocument): IReview {
    return {
      id: review.id,
      userId: review.userId instanceof Types.ObjectId ? review.userId : new Types.ObjectId(review.userId),
      gameId: review.gameId instanceof Types.ObjectId ? review.gameId : new Types.ObjectId(review.gameId),
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }

  async getAll(): Promise<IReview[]> {
    const reviews = await this.reviewModel
      .find()
      .populate('userId', 'username')
      .populate('gameId', 'title')
      .exec();
    return reviews.map(this.toIReview);
  }

  async getOne(id: string): Promise<IReview> {
    const review = await this.reviewModel
      .findById(id)
      .populate('userId', 'username')
      .populate('gameId', 'title')
      .exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return this.toIReview(review);
  }

  /**
   * Create a new review.
   */
  async create(createReviewDto: CreateReviewDto): Promise<IReview> {
    const newReview = new this.reviewModel({
      ...createReviewDto,
      userId: new Types.ObjectId(createReviewDto.userId),
      gameId: new Types.ObjectId(createReviewDto.gameId),
    });
    const savedReview = await newReview.save();

    // Push review into the embedded reviews in Game
    await this.gameModel.findByIdAndUpdate(
      createReviewDto.gameId,
      {
        $push: {
          reviews: {
            userId: createReviewDto.userId,
            rating: createReviewDto.rating,
            comment: createReviewDto.comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    );

    return this.toIReview(savedReview);
  }

  /**
   * Update a review.
   */
  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<IReview> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return this.toIReview(updatedReview);
  }

  /**
   * Delete a review.
   */
  async delete(id: string): Promise<void> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deletedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Remove from embedded reviews in Game
    await this.gameModel.findByIdAndUpdate(
      deletedReview.gameId,
      {
        $pull: {
          reviews: {
            userId: deletedReview.userId,
            createdAt: deletedReview.createdAt,
          },
        },
      },
      { new: true },
    );
  }
}
