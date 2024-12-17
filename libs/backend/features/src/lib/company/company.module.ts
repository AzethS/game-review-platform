// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { CompanyController } from './company.controller';
// import { CompanyService } from './company.service';
// import { Company, CompanySchema } from './company.schema';
// import { Game, GameSchema } from '../game/game.schema';


// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema },
//       { name: Game.name, schema: GameSchema },
//     ]), // Connect schema to MongoDB
//   ],
//   controllers: [CompanyController],
//   providers: [CompanyService],
//   exports: [CompanyService], // Optional: Export service incase other modules need access
// })
// export class CompanysModule {}
