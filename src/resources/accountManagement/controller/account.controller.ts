import { Request, Response } from "express";
import { AccountControllerInterface } from "../../../interfaces/controllerInterfaces/account.interfaces";
import Accounts from "../model/account.model";
import handleException from "../../../utils/handleExceptions";
import bcrypt from "bcrypt";
import AccountFeature from "./account.features";
import { sendOTPEmail } from "../../../utils/sendEmail";

class AccountController implements AccountControllerInterface {
  public async getAccountInfor(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const { partnersType } = req.body;
      if (partnersType == "verified") {
        // Accounts.findOne({ _id: req.body._id, verified: true })
        // .select("-password")
        // .clone()
        // .then((account: any) => {
        //   res.json({ account });
        // })
        // .catch((e: any) => {
        //   if (e) {
        //     handleException(400, e.message, res)
        //     return;
        //   }
        // })
      } else {
        Accounts.findOne({ _id: user_id })
          .populate("services")
          .populate("addresses")
          .select("-password")
          .clone()
          .then((account: any) => {
            res.json({ account });
          })
          .catch((e: any) => {
            if (e) {
              handleException(400, e.message, res);
              return;
            }
          });
      }
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async getAccountsInfor(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query);

      const accountFeature = new AccountFeature(req.query);
      await accountFeature.filter();
      const partners = accountFeature.query;

      console.log(partners);

      res.json({ message: "Thành công!", accounts: partners });

      // Accounts.find({ role: 'partner', verified: true })
      // .populate('service')
      // .select("-password")
      // .clone()
      // .then((partners: any) => {
      //   res.json({ partners: partners });
      // })
      // .catch((e: any) => {
      //   if (e) {
      //     handleException(400, e.message, res)
      //     return;
      //   }
      // })
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async verifyPartner(req: Request, res: Response): Promise<void> {
    try {
      const { partnerId, partnerEmail } = req.body;
      console.log(partnerEmail);
      await Accounts.updateOne(
        { _id: partnerId, role: "partner" },
        { verified: true }
      );
      await sendOTPEmail(partnerEmail, "", "verifyPartner");
      res.json({ message: "Thành công!" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async cancelVerificationPartner(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { partnerId, partnerEmail } = req.body;
      console.log(partnerEmail);
      await Accounts.updateOne(
        { _id: partnerId, role: "partner" },
        { verified: false }
      );
      await sendOTPEmail(partnerEmail, "", "unverifyPartner");
      res.json({ message: "Thành công!" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async deletePartner(req: Request, res: Response): Promise<void> {
    try {
      const { partnerId, partnerEmail } = req.body;
      console.log(partnerEmail);
      await Accounts.deleteOne({ _id: partnerId, role: "partner" });
      await sendOTPEmail(partnerEmail, "", "deletePartner");
      res.json({ message: "Thành công!" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async updateAccountBasicInfor(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const accountUpdate = req.body;
      console.log(accountUpdate);
      await Accounts.findOneAndUpdate(
        { _id: req.body._id },
        { ...accountUpdate }
      );
      res.json({ message: "Cập nhật thông tin thành công" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async updateAccountPassword(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { newPassword } = req.body;
      const passwordHash = await bcrypt.hash(newPassword, 8);
      await Accounts.findOneAndUpdate(
        { _id: req.body._id },
        { password: passwordHash }
      );
      res.json({ message: "Cập nhật mật khẩu thành công" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }

  public async getFavouritePartners(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { user_id } = req.params;
      const account = await Accounts.findById(user_id).populate({
        path: "favouritePartners",
        populate: {
          path: "services",
        },
        select: "avatar partnerName location cover",
      });

      res.json({
        favourite_partners: account?._doc?.favouritePartners,
        message: "Thành công",
      });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }
}

export default AccountController;
