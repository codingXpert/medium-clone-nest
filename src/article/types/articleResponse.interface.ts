import { ArticleEntity } from "../entity/article.entity";

export interface ArticleResponseInterface {
    article: ArticleEntity;      // packing the article entity in 'article' to send response to frontEnd
}