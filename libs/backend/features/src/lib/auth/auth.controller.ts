import { ValidateUserDto } from '@game-platform/backend/dto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from './auth.guard';
import { CreateUserDto } from '@game-platform/backend/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('validate')
  async validateUser(@Body() validateUserDto: ValidateUserDto): Promise<any> {
    const { emailAddress, password } = validateUserDto;
    const user = await this.authService.validateUser(emailAddress, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const token =
      (req.headers as { authorization?: string })?.authorization?.split(
        ' '
      )[1] ?? '';
    return this.authService.logout(token);
  }


  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
