import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<object | null> {
    this.logger.log(`Validating user with email: ${email}`, AuthService.name);

    try {
      const user = await this.userService.getOneByEmail(email);
      this.logger.debug(
        `Fetched user: ${JSON.stringify(user)}`,
        AuthService.name
      );

      if (!user || !user.password) {
        this.logger.warn(
          `User not found or password missing for email: ${email}`,
          AuthService.name
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      this.logger.debug(
        `Password match result: ${isPasswordMatching}`,
        AuthService.name
      );

      if (!isPasswordMatching) {
        this.logger.warn(
          `Password mismatch for email: ${email}`,
          AuthService.name
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        username: user.emailAddress,
        name: user.name,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + 3600);

      const response = {
        accessToken,
        expiresAt,
        status: 'success',
        result: 'User authorized successfully',
      };

      return response;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message, AuthService.name);
        throw error;
      } else {
        this.logger.error(
          'An unexpected error occurred during user validation',
          AuthService.name
        );
        throw new UnauthorizedException('An unknown error occurred');
      }
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
}
