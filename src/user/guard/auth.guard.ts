import { ExpressRequest } from "@app/types/expressRequest.interface";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<ExpressRequest>();
        if(request.user){
            return true; 
        }
        throw new HttpException('Not authorised' , HttpStatus.UNAUTHORIZED);
    }
}