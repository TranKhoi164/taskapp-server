import { NextFunction, Request, Response } from "express";


interface AccountMiddlewareInterface {
  registerWithEmailMiddleware(res: Request, req: Response, next: NextFunction): Promise<void>
  loginWithEmailMiddleware(res: Request,  req: Response, next: NextFunction): void
  authCheckMiddleware(res: Request,  req: Response, next: NextFunction): void
  refreshAccessTokenMiddleware(res: Request,  req: Response, next: NextFunction): void
  updateBasicInforMiddleware(res: Request, req: Response, next: NextFunction): void
  updatePasswordMiddleware(res: Request,  req: Response, next: NextFunction): Promise<void>
}

export default AccountMiddlewareInterface