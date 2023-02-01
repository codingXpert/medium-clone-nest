import { Injectable } from "@nestjs/common";

@Injectable()
export class TagService {

    display(): number[]{
        return [1,2,3]
    }
}