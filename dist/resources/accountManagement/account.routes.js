"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./controller/auth.controller"));
const account_controller_1 = __importDefault(require("./controller/account.controller"));
const jwt_controller_1 = __importDefault(require("./controller/jwt.controller"));
const account_middleware_1 = __importDefault(require("../../middlewares/account.middleware"));
const authCtrl = new auth_controller_1.default();
const accountCtrl = new account_controller_1.default();
//const authMiddleware = new AuthMiddleware()
//const accountMiddleware = new AccountMiddleware()
//const jwtMiddleware = new JwtMiddleware() f
const accountMiddleware = new account_middleware_1.default();
const jwt = new jwt_controller_1.default();
const accountRoutes = (0, express_1.Router)();
//  /account/...
// accountRoutes.post('/reset_password_email', authCtrl.sendResetPasswordEmail)
// accountRoutes.post('/reset_password_token', authCtrl.resetPasswordWithAccessToken)
//TODO: auth routes
// take 3 arguments: fullName, email, password
accountRoutes.post('/register_with_email', accountMiddleware.registerWithEmailMiddleware, authCtrl.registerWithEmail);
// email, password
accountRoutes.post('/login_with_email', accountMiddleware.loginWithEmailMiddleware, authCtrl.loginWithEmail);
// otp, userId, task
accountRoutes.post('/active_account_with_otp', accountMiddleware.verifyOtpMiddleware, authCtrl.activeAccountWithOTP);
// userId, email, task
accountRoutes.post('/resend_otp', authCtrl.resendOtp);
// get email, return message, userId
accountRoutes.post('/send_reset_password_email', authCtrl.sendResetPasswordEmail);
// get otp, userId, password, task, return message
accountRoutes.post('/reset_password_with_otp', accountMiddleware.verifyOtpMiddleware, authCtrl.resetPasswordWithOtp);
accountRoutes.get('/logout', accountMiddleware.authCheckMiddleware, authCtrl.userLogout);
//todo: partnerRoutes 
//get email, password, fullName, phoneNumber, description, partnerName, province, district, ward, address, service 
accountRoutes.get('/accounts_infor', accountCtrl.getAccountsInfor);
accountRoutes.post('/partner_register', accountMiddleware.registerWithEmailMiddleware, authCtrl.partnerRegister);
//TODO: account routes
//get fav partner
accountRoutes.get('/favourite_partners/:user_id', accountCtrl.getFavouritePartners);
//return message
accountRoutes.get('/account_infor/:user_id', accountCtrl.getAccountInfor);
//get fullname, dateOfBirth
accountRoutes.patch('/update_basic', accountMiddleware.authCheckMiddleware, accountMiddleware.updateBasicInforMiddleware, accountCtrl.updateAccountBasicInfor);
//get password, newPassword
accountRoutes.patch('/update_password', accountMiddleware.authCheckMiddleware, accountMiddleware.updatePasswordMiddleware, accountCtrl.updateAccountPassword);
//todo: partnerRoutes
//1 argument type: {active}
accountRoutes.get('/verified_partners', accountCtrl.getVerifiedPartners);
accountRoutes.get('/unverified_partners', accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, accountCtrl.getUnverifiedPartners);
//1 arg: {partnerId}
accountRoutes.patch('/verify_partner', accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, accountCtrl.verifyPartner);
accountRoutes.patch('/cancel_verification_partner', accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, accountCtrl.cancelVerificationPartner);
accountRoutes.delete('/delete_partner', accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, accountCtrl.deletePartner);
//TODO: jwtController
//return new access token
accountRoutes.post('/refresh_access_token', accountMiddleware.refreshAccessTokenMiddleware, jwt.refreshAccessToken);
//refresh refresh token and create new accessToken
accountRoutes.post('/refresh_refresh_token', jwt.refreshRefreshToken);
exports.default = accountRoutes;
