import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PlatformService } from './platforms.service';
import {
  CreatePlatformDto,
  UpdatePlatformDto,
} from '@game-platform/backend/dto';
import { IPlatform } from '@game-platform/shared/api';

@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  async getAll(): Promise<IPlatform[]> {
    return this.platformService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<IPlatform> {
    return this.platformService.getOne(id);
  }

  @Post()
  async create(
    @Body() createPlatformDto: CreatePlatformDto
  ): Promise<IPlatform> {
    return this.platformService.create(createPlatformDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlatformDto: UpdatePlatformDto
  ): Promise<IPlatform> {
    return this.platformService.update(id, updatePlatformDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.platformService.delete(id);
  }
  @Post(':id/games/:gameId')
  async addGameToPlatform(
    @Param('id') platformId: string,
    @Param('gameId') gameId: string
  ): Promise<void> {
    return this.platformService.addGameToPlatform(platformId, gameId);
  }

  @Delete(':id/games/:gameId')
  async removeGameFromPlatform(
    @Param('id') platformId: string,
    @Param('gameId') gameId: string
  ): Promise<void> {
    return this.platformService.removeGameFromPlatform(platformId, gameId);
  }
}
