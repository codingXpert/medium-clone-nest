import { FollowEntity } from "@app/profile/following.entity";
import { UserEntity } from "@app/user/entity/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { ArticleEntity } from "./entity/article.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity , UserEntity , FollowEntity])],
    providers: [ArticleService],
    controllers: [ArticleController]
})
export class ArticleModule {

}