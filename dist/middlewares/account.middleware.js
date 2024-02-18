"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_model_1 = __importDefault(require("../resources/accountManagement/model/account.model"));
const handleExceptions_1 = __importDefault(require("../utils/handleExceptions"));
const validate_1 = require("../utils/validate");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_controller_1 = __importDefault(require("../resources/accountManagement/controller/jwt.controller"));
const userOTPVerify_model_1 = __importDefault(require("../resources/accountManagement/model/userOTPVerify.model"));
const warning_1 = require("../utils/warning");
const jwtController = new jwt_controller_1.default();
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
class AccountMiddleware {
    //check to see if acc exist
    // validate email, password, fullName
    registerWithEmailMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, fullName } = req.body;
                console.log('body:', req.body);
                if (!email || !password || !fullName) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                if (!(0, validate_1.validateEmail)(email)) {
                    (0, handleExceptions_1.default)(400, warning_1.invalidEmailWarn, res);
                    return;
                }
                else if (!(0, validate_1.validatePassword)(password)) {
                    (0, handleExceptions_1.default)(400, warning_1.invalidPasswordWarn, res);
                    return;
                }
                next();
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    verifyOtpMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, otp, task } = req.body;
                console.log('verifyOtp: ', req.body);
                if (!userId || !otp || !task) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                const userOtpRecord = yield userOTPVerify_model_1.default.findOne({ userId: userId, task: task });
                if (!userOtpRecord) {
                    if (task === 'register') {
                        (0, handleExceptions_1.default)(400, "Mã otp không tồn tại hoặc đã được kích hoạt.", res);
                        return;
                    }
                    else if (task === 'resetPassword') {
                        (0, handleExceptions_1.default)(400, "Mã otp không còn tồn tại, yêu cầu mã otp mới", res);
                        return;
                    }
                }
                else {
                    const expiresAt = userOtpRecord === null || userOtpRecord === void 0 ? void 0 : userOtpRecord.expiresAt;
                    const hashedOTP = userOtpRecord === null || userOtpRecord === void 0 ? void 0 : userOtpRecord.otp;
                    console.log(userOtpRecord);
                    if (expiresAt.getTime() < Date.now()) {
                        yield userOTPVerify_model_1.default.deleteMany({ userId });
                        (0, handleExceptions_1.default)(400, "Mã OTP đã hết hạn, cần yêu cầu mã mới", res);
                        return;
                    }
                    else {
                        const validOTP = yield bcrypt_1.default.compare(otp, hashedOTP);
                        if (!validOTP) {
                            (0, handleExceptions_1.default)(400, "Mã OTP không hợp lệ, vui lòng kiểm tra lại email của bạn", res);
                            return;
                        }
                    }
                }
                next();
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    // validate email and password
    loginWithEmailMiddleware(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
            return;
        }
        if (!(0, validate_1.validateEmail)(email)) {
            (0, handleExceptions_1.default)(400, warning_1.invalidEmailWarn, res);
            return;
        }
        else if (!(0, validate_1.validatePassword)(password)) {
            (0, handleExceptions_1.default)(400, warning_1.invalidPasswordWarn, res);
            return;
        }
        next();
    }
    // check if the request obj contain access token
    // bind user id to request obj after veriy acct
    authCheckMiddleware(req, res, next) {
        try {
            const access_token = req.headers.authorization;
            console.log('ac_token: ', access_token);
            if (!access_token) {
                (0, handleExceptions_1.default)(400, warning_1.authorizationWarn, res);
                return;
            }
            jsonwebtoken_1.default.verify(access_token, String(process.env.JWT_ACCESS_TOKEN), (e, userData) => __awaiter(this, void 0, void 0, function* () {
                if (e) {
                    (0, handleExceptions_1.default)(400, e.message, res);
                    return;
                }
                req.body._id = userData._id;
                next();
            }));
        }
        catch (e) {
            (0, handleExceptions_1.default)(500, e.message, res);
        }
    }
    // find account by id then check if user is admin
    authAdminMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountId = req.body._id;
                console.log('adminId ', accountId);
                const checkUser = yield account_model_1.default.findOne({ _id: accountId });
                if ((checkUser === null || checkUser === void 0 ? void 0 : checkUser.role) !== 'admin') {
                    (0, handleExceptions_1.default)(400, warning_1.authorizationWarn, res);
                    return;
                }
                next();
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    // fullname, gender, role. Check if the fullName's length exceed 20 character
    updateBasicInforMiddleware(req, res, next) {
        try {
            if (!(0, validate_1.validateStringLength)(req.body.fullName, 25)) {
                (0, handleExceptions_1.default)(400, warning_1.fullNameWarn, res);
                return;
            }
            next();
        }
        catch (e) {
            (0, handleExceptions_1.default)(500, e.message, res);
        }
    }
    //validate password
    //compare the password in the request obj with old password to check whether the user know the password
    //update password from old to new
    updatePasswordMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, validate_1.validatePassword)(req.body.newPassword)) {
                    (0, handleExceptions_1.default)(400, warning_1.invalidPasswordWarn, res);
                    return;
                }
                const account = yield account_model_1.default.findOne({ _id: req.body._id });
                const checkPassword = yield bcrypt_1.default.compare(req.body.password, String(account === null || account === void 0 ? void 0 : account.password));
                if (!checkPassword) {
                    (0, handleExceptions_1.default)(400, warning_1.unMatchPasswordWarn, res);
                    return;
                }
                next();
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    // check if refresh-token exist in the cookie
    // create refresh-token and store it to the cookie if the cookie doesn't consist it
    refreshAccessTokenMiddleware(req, res, next) {
        try {
            let refresh_token = req.cookies.refreshtoken;
            if (!refresh_token) {
                refresh_token = jwtController.createRefreshToken({ _id: req.body._id }, res);
            }
            req.body.refresh_token = refresh_token;
            next();
        }
        catch (e) {
            (0, handleExceptions_1.default)(500, e.message, res);
        }
    }
}
exports.default = AccountMiddleware;
