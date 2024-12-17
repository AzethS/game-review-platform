import { BadRequestException, Controller, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { IUser, Role } from '@game-platform/shared/api';
import { ChangePasswordDto, CreateUserDto, UpdateUserDto, ValidateUserDto } from '@game-platform/backend/dto';
import { AuthGuard, Public } from '../auth/auth.guard';
import { Roles } from '../auth/roles.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // @UseGuards(AuthGuard)
    // @Roles(Role.Trainer, Role.Admin)
    @Get('')
    async getAll(): Promise<IUser[]> {
        const products = await this.userService.getAll();
        return products;
    }

    @Get('members')
    async findAllMembers(): Promise<IUser[]> {
      return await this.userService.getAllMembers();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IUser> {
        return await this.userService.getOne(id);
    }

    @Post('')
    async create(@Body() data: CreateUserDto) {
        const generatedId = await this.userService.create(data);
        return { id: generatedId};
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTrainingDto: UpdateUserDto) {
        return await this.userService.update(id, updateTrainingDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }
    
    // @HttpCode(HttpStatus.OK)
    // @Post('validate')
    // async validateUser(@Body() validateUserDto: ValidateUserDto): Promise<any> {
    //   const { emailAddress, password } = validateUserDto;
    //   const user = await this.userService.validateUser(emailAddress, password);
    //   if (!user) {
    //     throw new BadRequestException('Invalid credentials');
    //   }
    //   return user;
    // }
  
    @Patch(':id/change-password')
    async changePassword(@Param('id') userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<any> {
      const { currentPassword, newPassword } = changePasswordDto;
      await this.userService.changePassword(userId, currentPassword, newPassword);
      return { message: 'Password successfully changed' };
    }

}
