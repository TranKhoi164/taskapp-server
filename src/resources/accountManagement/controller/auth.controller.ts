import { Request, Response } from "express";
import { AuthControllerInterface } from "../../../interfaces/controllerInterfaces/account.interfaces";
import handleException from "../../../utils/handleExceptions";
import JwtController from "./jwt.controller";
import { sendOTPEmail } from "../../../utils/sendEmail";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Accounts from "../model/account.model";
import UserOTPVerification from "../model/userOTPVerify.model";
import { validatePassword, validatePhoneNumber } from "../../../utils/validate";
import { invalidPasswordWarn, missingInforWarn, phoneNumberWarn, unMatchPasswordWarn, unregisteredAccountWarn } from "../../../utils/warning";
import Addresses from "../../address/address.model";

const jwtFlow = new JwtController();

const { CLIENT_DEV, CLIENT_PRO, CLIENT_TEST, NODE_ENV } = process.env;

//userId, email, task
const sendOTP = async (data: any) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`

  const hashOTP = await bcrypt.hash(otp, 8)
  const newOTPVerification = new UserOTPVerification({
    userId: data?.userId,
    otp: hashOTP,
    task: data?.task,
    createdAt: Date.now(),
    expiresAt: Date.now() + 300000
  })
  await newOTPVerification.save()
  
  await sendOTPEmail(data?.email, otp, data?.task)
}


class AuthController implements AuthControllerInterface {
  public async registerWithEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName } = req.body;
      const passwordHash = await bcrypt.hash(password, 8);
      const newAccount = await Accounts.findOneAndUpdate(
        {email: email, verified: false}, 
        {email: email, password: passwordHash, fullName: fullName},
        {upsert: true, new: true}  
      )
      console.log('acc: ', newAccount);
      
      sendOTP({userId: String(newAccount?._id), email: email, task: 'register'})
      .then(() => {
        res.json({message: 'Kiểm tra email để lấy mã OTP', account: {_id: newAccount?._id, email: newAccount?.email}})
        return
      }).catch(e => {
        handleException(500, e.message, res)
      })
    } catch (e: any) {
      if (e?.code == 11000){
        handleException(400, 'Tài khoản đã được đăng ký từ trước', res);
        return
      }
      handleException(500, e.message, res);
    }
  }


  public async partnerRegister(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, phoneNumber, description, partnerName, services, addresses, location } = req.body;
      
      if (!email || !password || !fullName || !phoneNumber || !description || !partnerName || !addresses || !location) {
        handleException(400, missingInforWarn, res)
        return
      }

      if (!validatePhoneNumber(phoneNumber)) {
        handleException(400, phoneNumberWarn, res)
        return
      }
      
      const passwordHash = await bcrypt.hash(password, 8);

      const newAccount = await Accounts.findOneAndUpdate(
        {email: email, verified: false}, 
        {email: email,
          password: passwordHash,
          phoneNumber: phoneNumber,
          fullName: fullName,
          description: description,
          partnerName: partnerName,
          services: services,
          role: 'partner',
          addresses: addresses,
          location: location},
        {upsert: true, new: true}  
      )


      let resAccount = {...newAccount?._doc}
      delete resAccount['password']
      
      res.json({message: "Tài khoản đang được xét duyệt. Kết quả sẽ được gửi về email"})
    } catch (e: any) {
      // handleException(500, 'Tài khoản đã được tạo từ trước hoặc đang chờ xét duyệt', res);
      if (e?.code == 11000) {
        console.log(e);
        handleException(400, `${JSON.stringify(e?.keyValue)} đã được tạo từ trước`, res)
        return
      }
      handleException(500, e.message, res)
    }
  }



  public async activeAccountWithOTP(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.body

      await Accounts.updateOne({ _id: userId}, { verified: true })
      await UserOTPVerification.deleteMany({userId: userId})
      res.json({message: "Kích hoạt tài khoản thành công, đăng nhập để vào tài khoản"})
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }



  public async resendOtp(req: Request, res: Response) {
    try {
      const {userId, email, task} = req.body

      console.log('resednd: ', req.body);

      if (!userId || !email || !task) {
        handleException(400, missingInforWarn, res)
        return
      }
      await UserOTPVerification.deleteMany({userId: userId, task: task})
      sendOTP({userId: userId, email: email, task: task})
      .then(() => {
        res.json({message: 'Kiểm tra email để lấy mã OTP'})
        return
      }).catch(e => {
        handleException(500, e.message, res)
      })
    } catch (e: any) {
      handleException(500, e.message, res)
    } 
  }



  public async loginWithEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email + ' ' + password);
      const account = await Accounts.findOne({ email: String(email).toLowerCase(), status: 'active', verified: true })
      .populate('services')
      .populate('addresses')

      if (!account) {
        handleException(400, unregisteredAccountWarn, res);
        return;
      }
      const passwordMatch = await bcrypt.compare(
        password,
        String(account.password)
      );
      console.log(account);
      if (!passwordMatch) {
        handleException(400, unMatchPasswordWarn, res);
        return;
      }
      const access_token = jwtFlow.createAccessToken({ _id: account._id });
      jwtFlow.createRefreshToken({ _id: account._id }, res);

      let resAccount = {...account._doc}
      delete resAccount['password']

      res.json({ message: "Đăng nhập thành công", account: { ...resAccount, access_token } });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }




  public async sendResetPasswordEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;
      const user = await Accounts.findOne({ email: email, verified: true });
      if (!user) {
        handleException(400, unregisteredAccountWarn, res)
        return;
      }

      //payload: user email
      sendOTP({userId: user?._id, email: email, task: 'resetPassword'})
      .then(() => {
        res.json({ message: "Kiểm tra email để tạo mật khẩu mới", userId: user?._id });
      }).catch(e => {
        handleException(500, e.message, res)
      })
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }



  public async resetPasswordWithOtp(req: Request, res: Response): Promise<void> {
    try {
      const {userId, password} = req.body

      if (!validatePassword(password)) {
        handleException(400, invalidPasswordWarn, res)
        return
      }

      const passwordHash = await bcrypt.hash(password, 8)
      await Accounts.updateOne({ userId: userId }, {password: passwordHash})
      await UserOTPVerification.deleteMany({userId: userId, task: 'resetPassword'})
      res.json({message: 'Tạo mật khẩu mới thành công'})
    } catch(e: any) {
      handleException(500, e.message, res)
    }      
  }





  public userLogout(req: Request, res: Response): void {
    try {
      res.clearCookie("refreshtoken", { path: "/account/refresh_token" });
      res.json({ message: "Đăng xuất thành công" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }
}

export default AuthController;
