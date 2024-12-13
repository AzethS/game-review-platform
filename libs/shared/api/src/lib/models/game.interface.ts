export enum GameGenre {
    Action = 'Action',
    Adventure = 'Adventure',
    RPG = 'RPG',
    FPS = 'FPS',
    Strategy = 'Strategy',
    Puzzle = 'Puzzle',
    Other = 'Other',
  }
  
  export type User = string; // Later kan dit worden vervangen door een User-object als dat is geïmplementeerd.
  
  export interface IGame {
    id: string;
    title: string;
    description: string;
    genre: GameGenre;
    platform: string;
    releaseDate: Date;
    createdBy: User; // De gebruiker die het spel heeft toegevoegd.
  }
  
  export type ICreateGame = Pick<
    IGame,
    'title' | 'description' | 'genre' | 'platform' | 'releaseDate' | 'createdBy'
  >;
  
  export type IUpdateGame = Partial<Omit<IGame, 'id'>>;
  
  export type IUpsertGame = IGame;
  