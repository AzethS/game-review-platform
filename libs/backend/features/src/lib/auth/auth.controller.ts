import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { ValidateUserDto } from '@game-platform/backend/dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() validateUserDto: ValidateUserDto) {
    const user = await this.userService.validateUser(
      validateUserDto.emailAddress,
      validateUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
