import { ArticleEntity } from "../entity/article.entity";

export interface ArticlesResponseInterface {
    articles: ArticleEntity[];
    articlesCount: number;
}