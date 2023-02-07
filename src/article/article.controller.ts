import { User } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/entity/user.entity";
import { AuthGuard } from "@app/user/guard/auth.guard";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponseInterface } from "./types/articleResponse.interface";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService){}

    @Post()
    @UseGuards(AuthGuard)   // if the user is logged in (must have a token) , then only allow him to create articles
    async create(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface>{
        const article = await this.articleService.createArticle(currentUser , createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }
}