// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UserController } from './users.controller';
// import { UserService } from './users.service';
// import { UserSchema } from './users.schema';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthController } from '../auth/auth.controller';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
//     JwtModule.register({
//       // secret: 'JWT_SECRET', // Replace with environment variable
//       signOptions: { expiresIn: '1h' }, // Token expiry time
//     }),
//   ],
//   controllers: [UserController, AuthController],
//   providers: [UserService],
//   exports: [UserService],
// })
// export class UsersModule {}
