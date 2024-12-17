import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { IGame } from '@game-platform/shared/api';
import { CreateGameDto, UpdateGameDto } from '@game-platform/backend/dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * Get all games
   * GET /games
   */
  @Get()
  async getAll(): Promise<IGame[]> {
    return await this.gameService.getAll();
  }

  /**
   * Get a single game by ID
   * GET /games/:id
   */
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IGame> {
    return await this.gameService.getOne(id);
  }

  /**
   * Create a new game
   * POST /games
   */
  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const generatedId = await this.gameService.create(createGameDto);
    return { id: generatedId };
  }

  /**
   * Update a game by ID
   * PUT /games/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    const updatedId = await this.gameService.update(id, updateGameDto);
    return { id: updatedId };
  }

  /**
   * Delete a game by ID
   * DELETE /games/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.gameService.delete(id);
  }

  /**
   * Add a platform to a game
   * POST /games/:gameId/platforms/:platformId
   */
  @Post(':gameId/platforms/:platformId')
  async addPlatform(
    @Param('gameId') gameId: string,
    @Param('platformId') platformId: string,
  ) {
    return await this.gameService.addPlatform(gameId, platformId);
  }

  /**
   * Remove a platform from a game
   * DELETE /games/:gameId/platforms/:platformId
   */
  @Delete(':gameId/platforms/:platformId')
  async removePlatform(
    @Param('gameId') gameId: string,
    @Param('platformId') platformId: string,
  ) {
    return await this.gameService.removePlatform(gameId, platformId);
  }
}
