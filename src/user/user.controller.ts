import { UserResponseInterface } from "../types/userResponse.interface";
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post('user/login')
    @UsePipes(new ValidationPipe())
    async login(
        @Body('user') loginDto: any
    ): Promise<UserResponseInterface> {
        const user = await this.userService.login(loginDto);
        return this.userService.buildUserResponse(user)
    }

    // current user
    @Get('user')
    async currentUser(@Req() request: Request): Promise<UserResponseInterface> {
        console.log('controller ');

        return 'current user' as any

    }
}