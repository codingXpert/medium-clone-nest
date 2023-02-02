import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entity/user.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity>{
        const newUser = new UserEntity();
        Object.assign(newUser , createUserDto);
        console.log('newUser' , newUser);
        return await this.userRepository.save(newUser);
    }
}