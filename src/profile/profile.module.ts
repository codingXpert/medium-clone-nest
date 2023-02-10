import { UserEntity } from '@app/user/entity/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { FollowEntity } from './following.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity , FollowEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}