import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@game-platform/backend/dto';

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
      // Fetch the user and ensure password is included
      const user = await this.userService.getOneByEmail(email, true); // Explicitly fetch password
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

      // Compare the provided password with the stored hashed password
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

      // Prepare payload for JWT token
      const payload = {
        sub: user.id,
        id: user.id,
        username: user.emailAddress,
        name: user.name,
        role: user.role,
      };

      // Sign the token with expiry
      const accessToken = await this.jwtService.signAsync(payload);
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + 3600);

      // Return response with token
      return {
        accessToken,
        expiresAt,
        status: 'success',
        result: 'User authorized successfully',
        user: {
          id: user.id,
          name: user.name,
          emailAddress: user.emailAddress,
          role: user.role,
        },
      };
      
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error.message : 'Unknown error',
        AuthService.name
      );
      throw new UnauthorizedException('Validation failed');
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
  async register(createUserDto: CreateUserDto): Promise<any> {
    const existing = await this.userService.getOneByEmail(
      createUserDto.emailAddress,
      false,
      true
    );
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const newUser = await this.userService.create(createUserDto);


    return {
      id: newUser,
      message: 'Registration successful',
    };
  }
}
