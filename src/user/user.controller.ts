import { UserResponseInterface } from "../types/userResponse.interface";
import { Body, Controller, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserService } from "./user.service";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./entity/user.entity";
import { AuthGuard } from "./guard/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    //create user
    @Post('users')
    @UsePipes(new BackendValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post('user/login')
    @UsePipes(new BackendValidationPipe())
    async login(
        @Body('user') loginDto: any
    ): Promise<UserResponseInterface> {
        const user = await this.userService.login(loginDto);
        return this.userService.buildUserResponse(user)
    }

    // current user
    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
        console.log(user);

        return this.userService.buildUserResponse(user)

    }

    // Update user
    @Put('user')
    @UseGuards(AuthGuard)
    async updateCurretUser(@User('id') currentUserId: number , @Body('user') updateUserDto: UpdateUserDto
    ): Promise<UserResponseInterface>{
        const user = await this.userService.updateUser(currentUserId , updateUserDto);
        return this.userService.buildUserResponse(user);
    }
}