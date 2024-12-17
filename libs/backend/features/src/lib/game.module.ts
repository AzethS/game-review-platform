import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

// Schemas
import { UserSchema } from './users/users.schema';
import { CompanySchema } from './company/company.schema';
import { PlatformSchema } from './platforms/platforms.schema';
import { GameSchema } from './game/game.schema';
import { ReviewSchema } from './reviews/reviews.schema';

// Controllers
import { UserController } from './users/users.controller';
import { CompanyController } from './company/company.controller';
import { PlatformController } from './platforms/platforms.controller';
import { GameController } from './game/game.controller';
import { ReviewController } from './reviews/reviews.controller';

// Services
import { UserService } from './users/users.service';
import { CompanyService } from './company/company.service';
import { PlatformService } from './platforms/platforms.service';
import { GameService } from './game/game.service';
import { ReviewService } from './reviews/reviews.service';

// Auth
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { environment } from '@game-review-platform/shared/util-env';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Company', schema: CompanySchema },
      { name: 'Platform', schema: PlatformSchema },
      { name: 'Game', schema: GameSchema },
      { name: 'Review', schema: ReviewSchema },
    ]),
    JwtModule.register({
      secret: environment.jwtSecret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [
    UserController,
    CompanyController,
    PlatformController,
    GameController,
    ReviewController,
    AuthController,
  ],
  providers: [
    UserService,
    CompanyService,
    PlatformService,
    GameService,
    ReviewService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    UserService,
    CompanyService,
    PlatformService,
    GameService,
    ReviewService,
    AuthService,
  ],
})
export class GamePlatformModule {}
