import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    TAG = 'AuthService';
    // private blacklistedTokens: Set<string> = new Set();

  constructor(private userService: UserService,
    private jwtService: JwtService) {}

    // async create(createUserDto: CreateUserDto) {
    //     try {
    //         const hashedPassword = await this.hashPassword(createUserDto.password);
    //         // createUserDto.password = hashedPassword;
    //         const userToSave = {
    //             ...createUserDto,
    //             password: hashedPassword,
    //         };

    //         const createdUser = new this.userService.userModel(userToSave);
    //         const user = await createdUser.save();
    //         return user.id as string;
    //     } catch (error) {
    //         Logger.error(error);
    //         throw error;
    //     }
    // }

    // private async hashPassword(password: string): Promise<string> {
    //     const saltOrRounds = 10;
    //     return bcrypt.hash(password, saltOrRounds);
    // }
    
    async validateUser(email: string, pass: string): Promise<object | null> {
        Logger.log(`ValidateUser (${email})`, this.TAG);
        try {
            // const isBlacklisted = await this.isTokenBlacklisted(token);
            // if (isBlacklisted) {
            //     throw new Error('Invalid token');
            // }

            // // Decode and validate the token
            // const decoded = this.jwtService.decode(token);
            // if (!decoded) {
            //     throw new Error('Invalid token');
            // }
            
            const user = await this.userService.getOneByEmail(email);
            if (!user) {
                // User not found
                // return null;
                throw new NotFoundException();
            }

            const isPasswordMatching = await bcrypt.compare(pass, user.password);
            if (!isPasswordMatching) {
                // Passwords do not match
                // return null;
                throw new UnauthorizedException();
            }

            const payload = { sub: user.id, username: user.emailAddress, name: user.name, role: user.role };
            const accessToken = await this.jwtService.signAsync(payload);

            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + 3600);
            const response = {
                accessToken,
                expiresAt,
                status: 'success',
                result: "User authorized successfully"
            };

            return response;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async logout(token: string): Promise<{ message: string }> {
        // If you are maintaining a token blacklist, add the token to it
        // Otherwise, simply return a success message
        // await this.addToBlacklist(token);
        return { message: 'Logged out successfully' };
    }

    // async addToBlacklist(token: string): Promise<void> {
    //     // Store the token in a 'blacklist' collection or equivalent
    //     await this.databaseService.save('blacklist', { token });
    // }

    // async isTokenBlacklisted(token: string): Promise<boolean> {
    //     // Check if the token exists in the 'blacklist' collection
    //     const tokenRecord = await this.databaseService.findOne('blacklist', { token });
    //     return !!tokenRecord;
    // }
}