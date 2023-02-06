import { UserEntity } from '@app/user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './entity/article.entity';

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
        article.slug = 'foo'
        article.author = currentUser;
        return await this.articleRepository.save(article);
    }  
}
