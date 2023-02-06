import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly body: string;

    readonly taglist: string[];
}