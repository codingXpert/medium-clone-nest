import { UserEntity } from '@app/user/entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './following.entity';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({where:{username: profileUsername}});

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    return { ...user, following: false };     // returning the whole user + one additional field i.e; user
  }

  //building profile response
  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };       // returning the user as an object
  }

 // following a profile
async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({where:{ username: profileUsername}});

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following ids cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({where:{
      followerId: currentUserId,
      followingId: user.id,
  }});

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;    // assigning the values of currentUserId & user.id in followerId & followingId
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

}