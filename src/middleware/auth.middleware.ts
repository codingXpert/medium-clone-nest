import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '@app/types/expressRequest.interface';
import { JWT_SECRET } from '@app/secretKey/config';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {                 // middleware runs before controller . whenever we send request from postman the request is catched             
  constructor(private readonly userService: UserService) {}            //  by middleware & if needed we modify that incomming request & then called next() to pass the updated
  async use(req: ExpressRequest, res: Response, next: NextFunction) { // request back to the controller.
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    console.log(req.headers.authorization);
    console.log(req.headers.authorization.split(' ')[1]);   // splits the authorization & take the value of index 1.
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
