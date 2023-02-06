import { User } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/entity/user.entity";
import { AuthGuard } from "@app/user/guard/auth.guard";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService){}

    @Post()
    @UseGuards(AuthGuard)   // if the user is logged in (must have a token) , then only allow him to create articles
    async create(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ){
        return await this.articleService.createArticle(currentUser , createArticleDto)
    }
}