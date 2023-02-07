import { UserEntity } from '@app/user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './entity/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify  from 'slugify';

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository:Repository<ArticleEntity>){}

  // creating article
  async createArticle(
    currentUser: UserEntity, 
    createArticleDto: CreateArticleDto
    ):Promise<ArticleEntity> {
        const article = new ArticleEntity();                    
        Object.assign(article , createArticleDto);
        if(!article.tagList){
            article.tagList = [];
        }
        article.slug = this.getSlug(createArticleDto.title)
        article.author = currentUser;
        return await this.articleRepository.save(article);
    }  

    //Article response
    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface{
        return {article};
    }

    // generating unique slug
    private getSlug(title: string): string {
        return(slugify(title , {lower: true})) + '_' + ((Math.random()*Math.pow(36,6)|0).toString());
    }

    // find article by slug
    async findBySlug(slug: string):Promise<ArticleEntity>{
        return await this.articleRepository.findOne({where: {slug}});

    }
}
