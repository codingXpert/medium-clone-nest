import { Module } from "@nestjs/common";
import { ArticleService } from "./article.service";

Module({
    imports: [],
    providers: [ArticleService],
    controllers: [AbortController]
})
export class ArticleModule {

}