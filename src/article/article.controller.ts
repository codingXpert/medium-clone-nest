import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/entity/user.entity';
import { AuthGuard } from '@app/user/guard/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponseInterface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // find All using query builder
  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any
  ): Promise<ArticlesResponseInterface>{
    return this.articleService.findAll(currentUserId , query)
  }

  //create article
  @Post()
  @UseGuards(AuthGuard) // if the user is logged in (must have a token) , then only allow him to create articles
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  // get article by slug
  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  // Deleting By slug
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  //update article by slug
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      currentUserId,
    );
    return await this.articleService.buildArticleResponse(article);
  }


  //Liking or Add article to favorites 
  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addArticlesToFavorites(
    @User('id') currentUserId: number, 
    @Param('slug') slug: string): Promise<ArticleResponseInterface>{
      const article = await this.articleService.addArticleToFavorites(slug, currentUserId);
      return this.articleService.buildArticleResponse(article); 
    }

    //disliking the liked article or removing article from favorites 
  @Delete(':slug/favorites')
  @UseGuards(AuthGuard)
  async deleteArticlesFromFavorites(
    @User('id') currentUserId: number, 
    @Param('slug') slug: string): Promise<ArticleResponseInterface>{
      const article = await this.articleService.deleteArticlesFromFavorites(slug, currentUserId);
      return this.articleService.buildArticleResponse(article); 
    }
}
