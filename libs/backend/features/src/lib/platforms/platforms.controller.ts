import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { IPlatform } from '@game-platform/shared/api';
import { CreatePlatformDto, UpdatePlatformDto } from '@game-platform/backend/dto';
import { PlatformService } from './platforms.service';

@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  /**
   * Get all platforms
   * GET /platforms
   */
  @Get()
  async getAll(): Promise<IPlatform[]> {
    return await this.platformService.getAll();
  }

  /**
   * Get a single platform by ID
   * GET /platforms/:id
   */
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IPlatform> {
    return await this.platformService.getOne(id);
  }

  /**
   * Create a new platform
   * POST /platforms
   */
  @Post()
  async create(@Body() createPlatformDto: CreatePlatformDto) {
    const generatedId = await this.platformService.create(createPlatformDto);
    return { id: generatedId };
  }

  /**
   * Update an existing platform
   * PUT /platforms/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ) {
    const updatedId = await this.platformService.update(id, updatePlatformDto);
    return { id: updatedId };
  }

  /**
   * Delete a platform
   * DELETE /platforms/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.platformService.delete(id);
  }

  /**
   * Add a game to the platform
   * POST /platforms/:platformId/games/:gameId
   */
  @Post(':platformId/games/:gameId')
  async addGame(
    @Param('platformId') platformId: string,
    @Param('gameId') gameId: string,
  ) {
    return await this.platformService.addGame(platformId, gameId);
  }

  /**
   * Remove a game from the platform
   * DELETE /platforms/:platformId/games/:gameId
   */
  @Delete(':platformId/games/:gameId')
  async removeGame(
    @Param('platformId') platformId: string,
    @Param('gameId') gameId: string,
  ) {
    return await this.platformService.removeGame(platformId, gameId);
  }
}
