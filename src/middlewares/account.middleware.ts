import {Request, Response, NextFunction} from 'express'
import Accounts from "../resources/accountManagement/model/account.model";
import handleException from '../utils/handleExceptions';
import { validateEmail, validatePassword, validateStringLength } from '../utils/validate';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import JwtController from '../resources/accountManagement/controller/jwt.controller';
import AccountMiddlewareInterface from '../interfaces/middlewareInterfaces/account.interface';
import UserOTPVerification from '../resources/accountManagement/model/userOTPVerify.model';
import { authorizationWarn, fullNameWarn, invalidEmailWarn, invalidPasswordWarn, invalidProvidedInforWarn, missingInforWarn, unMatchPasswordWarn } from '../utils/warning';

const jwtController = new JwtController()

// async function checkAccountExistByEmailAndVerified(email: string) {
//   try {
//     const account = await Accounts.findOne({email: email})
//     if (!account) {
//       return false
//     } 
//     // if account is verified -> return true
//     // if not return false and delete account
//     if (!account?.verified) {
//       await UserOTPVerification.deleteMany({userId: account?._id})
//       await Accounts.deleteOne({email: email})
//       return false
//     } 
//     return true
//   } catch (e: any) {
//     throw new Error(e)
//   }
// }

class AccountMiddleware implements AccountMiddlewareInterface {
  //check to see if acc exist
  // validate email, password, fullName
  public async registerWithEmailMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, fullName } = req.body

      console.log('body:', req.body);

      if (!email || !password || !fullName) {
        handleException(400, missingInforWarn, res)
        return
      }
      if (!validateEmail(email)) {
        handleException(400, invalidEmailWarn, res)
        return 
      } else if (!validatePassword(password)) {
        handleException(400, invalidPasswordWarn, res)
        return
      }
      next()
    } catch(e: any) {
      handleException(500, e.message, res)
    }
  }

  public async verifyOtpMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, otp, task } = req.body

      console.log('verifyOtp: ', req.body);

      if (!userId || !otp || !task) {
        handleException(400, missingInforWarn, res)
        return
      }
      
      const userOtpRecord = await UserOTPVerification.findOne({userId: userId, task: task})
      if (!userOtpRecord) {
        if (task === 'register') {
          handleException(400, "Mã otp không tồn tại hoặc đã được kích hoạt.", res)
          return
        } else if (task === 'resetPassword') {
          handleException(400, "Mã otp không còn tồn tại, yêu cầu mã otp mới", res)
          return 
        }
      } else {
        const expiresAt = userOtpRecord?.expiresAt
        const hashedOTP = userOtpRecord?.otp

        console.log(userOtpRecord);

        if (expiresAt.getTime() < Date.now()) {
          await UserOTPVerification.deleteMany({userId})
          handleException(400, "Mã OTP đã hết hạn, cần yêu cầu mã mới", res)
          return
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP)

          if (!validOTP) {
            handleException(400, "Mã OTP không hợp lệ, vui lòng kiểm tra lại email của bạn", res)
            return
          } 
        }
      }
      next()
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  // validate email and password
  public loginWithEmailMiddleware(req: Request, res: Response, next: NextFunction): void {
    const {email, password} = req.body

    if (!email || !password) {
      handleException(400, missingInforWarn, res)
      return
    }
    if (!validateEmail(email)) {
      handleException(400, invalidEmailWarn, res)
      return
    } else if (!validatePassword(password)) {
      handleException(400, invalidPasswordWarn, res)
      return
    }
    next()
  }

  // check if the request obj contain access token
  // bind user id to request obj after veriy acct
  public authCheckMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
      const access_token = req.headers.authorization
      console.log('ac_token: ', access_token);
      if (!access_token) {
        handleException(400, authorizationWarn, res)
        return
      }
      jwt.verify(access_token, String(process.env.JWT_ACCESS_TOKEN), async (e: any, userData: any) => {
        if (e) {
          handleException(400, e.message, res)
          return
        }
        req.body._id = userData._id
        next()
      })
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  // find account by id then check if user is admin
  public async authAdminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accountId = req.body._id
      console.log('adminId ', accountId);
      const checkUser = await Accounts.findOne({_id: accountId})
      if (checkUser?.role !== 'admin') {
        handleException(400, authorizationWarn, res)
        return
      }
      next()
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  // fullname, gender, role. Check if the fullName's length exceed 20 character
  public updateBasicInforMiddleware(req: Request, res: Response, next: NextFunction): void {
    try { 
      if (!validateStringLength(req.body.fullName, 25)) {
        handleException(400, fullNameWarn, res)
        return
      }
      next()
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  //validate password
  //compare the password in the request obj with old password to check whether the user know the password
  //update password from old to new
  public async updatePasswordMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
      if (!validatePassword(req.body.newPassword)) {
        handleException(400, invalidPasswordWarn, res)
        return
      }
      const account = await Accounts.findOne({ _id: req.body._id })
      const checkPassword = await bcrypt.compare(req.body.password, String(account?.password))
      if (!checkPassword) {
        handleException(400, unMatchPasswordWarn, res)
        return
      }
      next()
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  // check if refresh-token exist in the cookie
  // create refresh-token and store it to the cookie if the cookie doesn't consist it
  refreshAccessTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
      let refresh_token = req.cookies.refreshtoken
      if (!refresh_token) {
        refresh_token = jwtController.createRefreshToken({_id: req.body._id}, res)
      } 
      req.body.refresh_token = refresh_token
      next()
    } catch(e: any) {
      handleException(500, e.message, res)
    }
  }
}

export default AccountMiddleware