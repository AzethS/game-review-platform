import { Injectable, NotFoundException } from '@nestjs/common';
import { GameGenre, IGame } from '@game-platform/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';
import { CreateGameDto } from '@game-platform/backend/dto';

@Injectable()
export class GameService {
  private TAG = 'GameService';

  private games$ = new BehaviorSubject<IGame[]>([
    {
      id: '1',
      title: 'Legend of Zelda',
      description: 'An epic adventure game.',
      genre: GameGenre.Adventure, // Use enum value
      platform: 'Nintendo Switch',
      releaseDate: new Date('2017-03-03'),
      createdBy: 'user-1',
    },
  ]);

  getAll(): IGame[] {
    Logger.log('getAll', this.TAG);
    return this.games$.value;
  }

  getOne(id: string): IGame {
    Logger.log(`getOne(${id})`, this.TAG);
    const game = this.games$.value.find((g) => g.id === id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }
  create(gameDto: CreateGameDto): IGame {
    Logger.log('create', this.TAG);

    const newGame: IGame = {
      ...gameDto,
      id: `game-${Date.now()}`, // Generate a unique ID
    };

    this.games$.next([...this.games$.value, newGame]);
    return newGame;
  }
}
