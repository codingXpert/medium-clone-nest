import { ArticleType } from "./articles.type";

export interface ArticlesResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}