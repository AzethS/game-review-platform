import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewRefDto,
} from '@game-platform/backend/dto';
import { ReviewService } from './reviews.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll(): Promise<ReviewRefDto[]> {
    return await this.reviewService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ReviewRefDto> {
    return await this.reviewService.getOne(id);
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const generatedId = await this.reviewService.create(createReviewDto);
    return { id: generatedId };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    const updatedId = await this.reviewService.update(id, updateReviewDto);
    return { id: updatedId };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.reviewService.delete(id);
    return { message: `Review with ID ${id} deleted successfully.` };
  }

  @Get('user/:userId')
  async getReviewsByUser(@Param('userId') userId: string): Promise<ReviewRefDto[]> {
    return await this.reviewService.getReviewsByUser(userId);
  }

  @Get('game/:gameId')
  async getReviewsByGame(@Param('gameId') gameId: string): Promise<ReviewRefDto[]> {
    return await this.reviewService.getReviewsByGame(gameId);
  }

  @Get('game/:gameId/average-rating')
  async getAverageRating(@Param('gameId') gameId: string): Promise<number> {
    return await this.reviewService.getAverageRating(gameId);
  }
}
