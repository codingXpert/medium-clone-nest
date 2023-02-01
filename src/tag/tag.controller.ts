import { Controller } from "@nestjs/common";

@Controller('/tag')
export class TagController {

display(){
    return [1,2,3]
}

}