import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { IReview, Id, IUser, IGame } from '@game-platform/shared/api';
import { CreateReviewDto, UpdateReviewDto } from '@game-platform/backend/dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<IReview>,
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Game') private readonly gameModel: Model<IGame>
  ) {}

  /**
   * Convert Mongoose document to IReview
   */
  private toIReview(review: any): IReview {
    const reviewObject = review.toObject();
    return {
      ...reviewObject,
      id: reviewObject._id.toHexString(),
      gameId: reviewObject.gameId?._id
        ? { id: reviewObject.gameId._id.toHexString(), title: reviewObject.gameId.title }
        : reviewObject.gameId, // fallback if not populated
      userId: reviewObject.userId?._id
        ? { id: reviewObject.userId._id.toHexString(), name: reviewObject.userId.name }
        : reviewObject.userId,
    };
  }
  async create(createReviewDto: CreateReviewDto): Promise<string> {
    try {
      const newReview = new this.reviewModel(createReviewDto);
      const savedReview = await newReview.save();

      // These are always strings now, no need for type check
      const userId = createReviewDto.userId;
      const gameId = createReviewDto.gameId;

      // Update user's reviewsGiven array
      await this.userModel.findByIdAndUpdate(
        userId,
        { $push: { reviewsGiven: savedReview._id } },
        { new: true }
      );

      // Update game's reviews array
      await this.gameModel.findByIdAndUpdate(
        gameId,
        { $push: { reviews: savedReview._id } },
        { new: true }
      );

      return savedReview._id.toHexString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create review.');
    }
  }

  /**
   * Retrieve all reviews
   */
  async getAll(): Promise<IReview[]> {
    try {
      const reviews = await this.reviewModel
        .find()
        .populate('userId', 'name') // Populate only the name field of the user
        .populate('gameId', 'title') // Populate only the title field of the game
        .exec();
      return reviews.map(this.toIReview);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to retrieve reviews.');
    }
  }

  /**
   * Retrieve a single review by ID
   */
  async getOne(id: string): Promise<IReview> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format.');
      }

      const review = await this.reviewModel
        .findById(id)
        .populate('userId gameId')
        .exec();
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found.`);
      }

      return this.toIReview(review);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to retrieve review with ID ${id}.`);
    }
  }

  /**
   * Retrieve all reviews by a specific user
   */
  async getReviewsByUser(userId: string): Promise<IReview[]> {
    try {
      if (!isValidObjectId(userId)) {
        throw new BadRequestException('Invalid User ID format.');
      }

      const reviews = await this.reviewModel
        .find({ userId })
        .populate('gameId')
        .exec();
      return reviews.map(this.toIReview);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        `Failed to retrieve reviews for User ID ${userId}.`
      );
    }
  }

  /**
   * Retrieve all reviews for a specific game
   */
  async getReviewsByGame(gameId: string): Promise<IReview[]> {
    try {
      if (!isValidObjectId(gameId)) {
        throw new BadRequestException('Invalid Game ID format.');
      }

      const reviews = await this.reviewModel
        .find({ gameId })
        .populate('userId')
        .exec();
      return reviews.map(this.toIReview);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        `Failed to retrieve reviews for Game ID ${gameId}.`
      );
    }
  }

  /**
   * Retrieve the average rating for a specific game
   */
  async getAverageRating(gameId: string): Promise<number> {
    try {
      if (!isValidObjectId(gameId)) {
        throw new BadRequestException('Invalid Game ID format.');
      }

      const result = await this.reviewModel.aggregate([
        { $match: { gameId } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } },
      ]);

      return result.length > 0 ? result[0].averageRating : 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        `Failed to calculate average rating for Game ID ${gameId}.`
      );
    }
  }

  /**
   * Update a review by ID
   */
  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<string> {
    try {
      const review = await this.reviewModel.findById(id).exec();
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found.`);
      }

      const updatedReview = await this.reviewModel
        .findByIdAndUpdate(id, updateReviewDto, { new: true })
        .exec();

      if (!updatedReview) {
        throw new NotFoundException(`Failed to update review with ID ${id}.`);
      }

      // Update user and game references if they are changed
      if (updateReviewDto.userId) {
        const newUserId =
          typeof updateReviewDto.userId === 'string'
            ? updateReviewDto.userId
            : updateReviewDto.userId.id;

        if (newUserId !== review.userId.toString()) {
          await this.userModel.findByIdAndUpdate(review.userId, {
            $pull: { reviewsGiven: id },
          });
          await this.userModel.findByIdAndUpdate(newUserId, {
            $push: { reviewsGiven: id },
          });
        }
      }

      if (updateReviewDto.gameId) {
        const newGameId =
          typeof updateReviewDto.gameId === 'string'
            ? updateReviewDto.gameId
            : updateReviewDto.gameId.id;

        if (newGameId !== review.gameId.toString()) {
          await this.gameModel.findByIdAndUpdate(review.gameId, {
            $pull: { reviews: id },
          });
          await this.gameModel.findByIdAndUpdate(newGameId, {
            $push: { reviews: id },
          });
        }
      }

      return updatedReview._id.toHexString();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to update review with ID ${id}.`);
    }
  }

  /**
   * Delete a review by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const review = await this.reviewModel.findById(id).exec();
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found.`);
      }

      // Remove references from user and game
      await this.userModel.findByIdAndUpdate(review.userId, {
        $pull: { reviewsGiven: id },
      });
      await this.gameModel.findByIdAndUpdate(review.gameId, {
        $pull: { reviews: id },
      });

      await this.reviewModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(`Failed to delete review with ID ${id}.`);
    }
  }
}
