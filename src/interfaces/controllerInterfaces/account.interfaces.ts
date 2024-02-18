import { Request, Response } from "express";

export interface AccountControllerInterface {
  getAccountInfor(req: Request, res: Response): Promise<void>
  updateAccountBasicInfor(req: Request, res: Response): Promise<void>
  updateAccountPassword(req: Request, res: Response): Promise<void>
}

export interface AuthControllerInterface {
  registerWithEmail(req: Request, res: Response): Promise<void>
  loginWithEmail(req: Request, res: Response): Promise<void>
  activeAccountWithOTP(req: Request, res: Response): Promise<void>
  resendOtp(req: Request, res: Response): Promise<void>
  sendResetPasswordEmail(req: Request, res: Response): Promise<void>
  resetPasswordWithOtp(req: Request, res: Response): Promise<void>
  userLogout(req: Request, res: Response): void
}

export interface JwtControllerInterface {
  createAccessToken(payload: any): string
  createRefreshToken(payload: any, res: Response): string
  refreshAccessToken(req: Request, res: Response): void
}
