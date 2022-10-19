import {
  createParamDecorator,
  HttpStatus,
  Injectable,
  NestMiddleware
} from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { Response } from 'express'
import { auth } from 'firebase-admin'
import { getAuth } from 'firebase-admin/lib/auth'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, _: Response, next: () => void) {
    const { authorization } = req.headers
    if (!authorization) {
      next()
      return
    }
    const token = authorization.replace('Bearer ', '')

    req.decodedIdToken = await getAuth()
      .verifyIdToken(token)
      .catch((err) => {
        throw new HttpException(
          { message: 'Input data validation failed', err },
          HttpStatus.UNAUTHORIZED
        )
      })
    next()
  }
}

export const DecodedIdToken = createParamDecorator(
  (data, [root, args, ctx, info]) =>
    ctx.req.decodedIdToken as auth.DecodedIdToken
)
