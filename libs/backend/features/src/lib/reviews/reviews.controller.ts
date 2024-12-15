import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from '@game-platform/backend/dto';
import { IReview } from '@game-platform/shared/api';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll(): Promise<IReview[]> {
    return this.reviewService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IReview> {
    return this.reviewService.getOne(id);
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<IReview> {
    return this.reviewService.create(createReviewDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<IReview> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.reviewService.delete(id);
  }
}
