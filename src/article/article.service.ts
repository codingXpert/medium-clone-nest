import { UserEntity } from '@app/user/entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './entity/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './types/articlesResponseInterface';
import { FollowEntity } from '@app/profile/following.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

    // find all using query Builder(pagination)
    async findAll(currentUserId: number , query:any): Promise<ArticlesResponseInterface>{
        const queryBuilder = this.dataSource.getRepository(ArticleEntity)
        .createQueryBuilder('articles')
        .leftJoinAndSelect('articles.author' , 'author');  // joining author of the article . if you want only the articles not the author of that article , just commit this line

        // searching or filtering by tagList
        if(query.tag){
          queryBuilder.andWhere('articles.tagList LIKE  :tag' , {   // in where() we can apply only a single condition , But in andWhere() we can apply multiple conditions 
            tag :`%${query.tag}%`
          })  
        }

        // searching or filtering articles related to an author
        if(query.author){
          const author = await this.userRepository.findOne({where:{username:query.author}});
          queryBuilder.andWhere('articles.author = :id' , {
            id: author.id
          })
        }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
             where:{username:query.favorited},
             relations: ['favorites']
           },
      );
      const ids = author.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }


        queryBuilder.orderBy('articles.createdAt' , 'DESC')
        const articlesCount = await queryBuilder.getCount();
        if(query.limit){
            queryBuilder.limit(query.limit);
        }
        if(query.offset){
            queryBuilder.offset = (query.offset);
        }

       
        let favoriteIds: number[] = [];

        if (currentUserId) {
          const currentUser = await this.userRepository.findOne(
            {where:{id:currentUserId}, 
            relations: ['favorites'],
          });
          favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
          console.log(favoriteIds);
          
        }
    
        const articles = await queryBuilder.getMany();
        const articlesWithFavorited = articles.map((article) => {
          const favorited = favoriteIds.includes(article.id);
          return { ...article, favorited };
        });
    
        return { articles: articlesWithFavorited, articlesCount };
    }

  // creating article
  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  // get Feed of current logged-in user
  async getFeed(currentUserId: number , query: any):Promise<ArticlesResponseInterface>{
    const follows = await this.followRepository.find({where:{followerId:currentUserId}});  
    if(follows.length === 0){
        return  {articles: [] , articlesCount:0};
    }
    const followingUserIds = follows.map((follow) => follow.followingId);  // all ids of the  users  that our current user is following
    const queryBuilder = this.dataSource.getRepository(ArticleEntity).createQueryBuilder('articles')
    .leftJoin('articles.author' ,  'auther')
    .where('articles.authorId IN(:...ids)' , {ids: followingUserIds});

    queryBuilder.orderBy('articles.createdAt' , 'DESC');  

    const articlesCount = await queryBuilder.getCount();

    if(query.limit){
      queryBuilder.limit(query.limit);
    }

    if(query.offset){
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles , articlesCount };
  }

  //Article response
  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  // generating unique slug
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '_' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString()
    );
  }

  // find article by slug
  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  // deleting article by slug
  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    // <DeleteResult> is a default value
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an auther', HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({ slug });
  }

  // update article by slug
  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an auther', HttpStatus.FORBIDDEN);
    }
    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  //Adding Article To Favorites
 async addArticleToFavorites(
  slug: string,
  userId: number,
): Promise<ArticleEntity> {
  const article = await this.findBySlug(slug);
  const user = await this.userRepository.findOne({where:{id: userId} , relations: ['favorites']});

  const isNotFavorited =
    user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,   // checking whether the article is favorted or not (-1 means not favorited)
    ) === -1;

  if (isNotFavorited) {
    user.favorites.push(article);
    article.favoritesCount++;
    await this.userRepository.save(user);
    await this.articleRepository.save(article);
  }

  return article;
}

//disliking the liked article or removing article from favorites 
async deleteArticlesFromFavorites(slug: string , userId:number): Promise<ArticleEntity>{
  const article = await this.findBySlug(slug);
  const user = await this.userRepository.findOne({where:{id: userId} , relations: ['favorites']});

  const articleIndex =
    user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,  
    );
    if(articleIndex >= 0){
      user.favorites.splice(articleIndex , 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
}
}
