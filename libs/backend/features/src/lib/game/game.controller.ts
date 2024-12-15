import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto, CreateReviewDto } from '@game-platform/backend/dto';
import { Game } from './game.schema';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAll(): Promise<Game[]> {
    return this.gameService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Game> {
    return this.gameService.getOne(id);
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Post(':id/reviews')
  async addReview(
    @Param('id') id: string,
    @Body() reviewDto: CreateReviewDto,
  ): Promise<Game> {
    return this.gameService.addReview(id, reviewDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.gameService.delete(id);
  }
}
