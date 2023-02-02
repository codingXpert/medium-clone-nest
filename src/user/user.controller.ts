import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController {
constructor(private readonly userService: UserService){}
    @Post('users')
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any>{
        return this.userService.createUser(createUserDto);
    }

}