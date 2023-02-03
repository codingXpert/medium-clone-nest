import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig'
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)    //the name of the middleware you want to apply
      .forRoutes({
        path: '*', method: RequestMethod.ALL // the routes you want to apply the middleware(here, * for all the routes)
      })
  }
}
