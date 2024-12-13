import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { IGame } from '@game-platform/shared/api';
import { CreateGameDto } from '@game-platform/backend/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('games') // Groepeer de endpoints onder 'games' in Swagger
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Retrieve all games' })
  @ApiResponse({ status: 200, description: 'List of all games.' })
  @Get()
  getAll(): IGame[] {
    return this.gameService.getAll();
  }

  @ApiOperation({ summary: 'Retrieve a single game by ID' })
  @ApiResponse({ status: 200, description: 'Game found.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @Get(':id')
  getOne(@Param('id') id: string): IGame {
    return this.gameService.getOne(id);
  }

  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: 201, description: 'Game successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post()
  create(@Body() createGameDto: CreateGameDto): IGame {
    return this.gameService.create(createGameDto);
  }
}

