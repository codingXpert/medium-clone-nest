import { UserEntity } from "@app/user/entity/user.entity"
import {Request} from 'express'

export interface ExpressRequest extends Request {
  user?: UserEntity
}