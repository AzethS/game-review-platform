import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUser, Id } from '@game-platform/shared/api';
// import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '@game-platform/backend/dto';
import * as bcrypt from 'bcrypt';
import { isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
    TAG = 'UserService';

    constructor(@InjectModel('User') private readonly userModel: Model<IUser>,
    private jwtService: JwtService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const hashedPassword = await this.hashPassword(createUserDto.password);
            // createUserDto.password = hashedPassword;
            const userToSave = {
                ...createUserDto,
                password: hashedPassword,
            };

            const createdUser = new this.userModel(userToSave);
            const user = await createdUser.save();
            return user.id as string;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }
    
    async validateUser(email: string, pass: string): Promise<string | null> {
        try {
            const user = await this.userModel.findOne({ emailAddress: email }).exec();
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

            // Convert to DTO or desired format if necessary
            // const userObject = user.toObject() as any;
            // userObject.id = userObject._id?.toHexString();
            // delete userObject._id;
            // delete userObject.password; // Don't return the password hash
            // return userObject as IUser;

            const payload = { sub: user.id, username: user.emailAddress, name: user.name, role: user.role };
            const accessToken = await this.jwtService.signAsync(payload);
            return accessToken;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async changePassword(userId: Id, currentPassword: string, newPassword: string): Promise<boolean> {
        try {
          const user = await this.userModel.findById(userId).exec();
          if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
          }
    
          // Verify current password
          const isPasswordMatching = await bcrypt.compare(currentPassword, user.password);
          if (!isPasswordMatching) {
            throw new BadRequestException('Current password is incorrect');
          }
    
          // Hash new password
          const hashedNewPassword = await this.hashPassword(newPassword);
    
          // Update user's password
          user.password = hashedNewPassword;
          await user.save();
    
          return true;
        } catch (error) {
          Logger.error(error);
          throw error;
        }
      }

    async getAll(): Promise<IUser[]> {
      Logger.log('getAll', this.TAG);
      try {
          const users = await this.userModel.find().exec();
          return users.map(user => {
            const userObject = user.toObject() as any;
            // Replace '_id' with 'id'
            userObject.id = userObject._id?.toHexString();
            delete userObject._id;
            delete userObject.password;
            return userObject as IUser;
        });
      } catch (error) {
            Logger.error(error);
            throw error;
      }
    }
    
      async getOne(id: Id): Promise<IUser> {
        Logger.log(`getOne(${id})`, this.TAG);
        if (!isValidObjectId(id)) {
          throw new BadRequestException('Invalid ID format');
        }
        try {
            const user = await this.userModel.findById(id).exec();
            if (!user) {
              throw new NotFoundException(`User with ID ${id} not found`);
            }
            const userObject = user.toObject() as any;
            // Replace '_id' with 'id'
            userObject.id = userObject._id?.toHexString();
            delete userObject._id;
            delete userObject.password;
            return userObject as IUser;
            
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }
    

    async getOneByEmail(email: string): Promise<IUser> {
      Logger.log(`getOneByEmail(${email})`, this.TAG);
      try {
          const user = await this.userModel.findOne({ emailAddress: email }).exec();
          if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
          }
          const userObject = user.toObject() as any;
          // Replace '_id' with 'id'
          userObject.id = userObject._id?.toHexString();
          delete userObject._id;
          // delete userObject.password;
          return userObject as IUser;
          
      } catch (error) {
          Logger.error(error);
          throw error;
      }
    }

    async update(id: string, updateUserDto: UpdateUserDto)
      {
        try {
            const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
            if (!user) {
              throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user.id as string;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
      }
    
      async delete(id: string): Promise<any> {
        try {
            const user = await this.userModel.findByIdAndDelete(id).exec();
            if (!user) {
              throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
        
      }

      async getAllMembers(): Promise<IUser[]> {
        Logger.log('getAllMembers', this.TAG);
        try{
          const members = await this.userModel.find({ role: 'Member' }).exec();
          return members.map(member => {
            const memberObject = member.toObject() as any;
            memberObject.id = memberObject._id?.toHexString();
            delete memberObject._id;
            delete memberObject.password;
            return memberObject as IUser;
          });
        } catch (error) {
          console.log(error);
          Logger.error(error);
          throw error;
        }
      }
}