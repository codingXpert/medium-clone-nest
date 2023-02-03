import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entity/user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/secretKey/config';
import { UserResponseInterface } from '../types/userResponse.interface';
import { loginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }
  //create user
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (userByEmail || userByEmail) {
      throw new HttpException(
        'Email or Username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  //generate token
  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  // building user response
  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  //login
  async login(loginUserDto: loginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'] //since we are not selecting the password from userEntity & that's why we are selecting all fields explicitly here
    });
    if (!user) {
      throw new HttpException(
        'credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;    // deleting the password before sending the response to frontEnd
    return user;
  }

  // findById
  async findById(decode) {
    const id = decode.id;

    return await this.userRepository.findOne({ where: { id } });
  }
}
