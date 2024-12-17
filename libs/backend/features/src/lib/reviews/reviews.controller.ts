import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { IReview } from '@game-platform/shared/api';
import { CreateReviewDto, UpdateReviewDto } from '@game-platform/backend/dto';
import { ReviewService } from './reviews.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * Get all reviews
   * GET /reviews
   */
  @Get()
  async getAll(): Promise<IReview[]> {
    return await this.reviewService.getAll();
  }

  /**
   * Get a single review by ID
   * GET /reviews/:id
   */
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IReview> {
    return await this.reviewService.getOne(id);
  }

  /**
   * Create a new review
   * POST /reviews
   */
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const generatedId = await this.reviewService.create(createReviewDto);
    return { id: generatedId };
  }

  /**
   * Update a review by ID
   * PUT /reviews/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const updatedId = await this.reviewService.update(id, updateReviewDto);
    return { id: updatedId };
  }

  /**
   * Delete a review by ID
   * DELETE /reviews/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.reviewService.delete(id);
    return { message: `Review with ID ${id} deleted successfully.` };
  }

  /**
   * Get all reviews by a specific user
   * GET /reviews/user/:userId
   */
  @Get('user/:userId')
  async getReviewsByUser(@Param('userId') userId: string): Promise<IReview[]> {
    return await this.reviewService.getReviewsByUser(userId);
  }

  /**
   * Get all reviews for a specific game
   * GET /reviews/game/:gameId
   */
  @Get('game/:gameId')
  async getReviewsByGame(@Param('gameId') gameId: string): Promise<IReview[]> {
    return await this.reviewService.getReviewsByGame(gameId);
  }

  /**
   * Get the average rating for a specific game
   * GET /reviews/game/:gameId/average-rating
   */
  @Get('game/:gameId/average-rating')
  async getAverageRating(@Param('gameId') gameId: string): Promise<number> {
    return await this.reviewService.getAverageRating(gameId);
  }
}
