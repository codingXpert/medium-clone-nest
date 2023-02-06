import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { AuthGuard } from "./guard/auth.guard";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService , AuthGuard],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {

}