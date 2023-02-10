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

  //get profile
  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({where:{username: profileUsername}});

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    const follow = await this.followRepository.findOne({where:{followerId:currentUserId, followingId: user.id}})
    return { ...user, following: Boolean(follow) };     // returning the whole user + one additional field i.e; following
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

    if (!follow) {   // we are saving the currentId & user.id inside follow
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;    // assigning the values of currentUserId & user.id in followerId & followingId
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);      //saving to DB
    }

    return { ...user, following: true };
  }

  //unfollow an user/profile
  async unfollowProfile(
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
     await this.followRepository.delete({     //deleting from DB
        followerId: currentUserId,
        followingId: user.id
     });
    return { ...user, following: false };
  }

}