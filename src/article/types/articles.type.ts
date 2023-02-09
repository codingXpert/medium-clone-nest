import { ArticleEntity } from "../entity/article.entity";

export type ArticleType = Omit<ArticleEntity, 'updateTimeStamp'>;