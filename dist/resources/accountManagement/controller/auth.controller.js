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
const handleExceptions_1 = __importDefault(require("../../../utils/handleExceptions"));
const jwt_controller_1 = __importDefault(require("./jwt.controller"));
const sendEmail_1 = require("../../../utils/sendEmail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const account_model_1 = __importDefault(require("../model/account.model"));
const userOTPVerify_model_1 = __importDefault(require("../model/userOTPVerify.model"));
const validate_1 = require("../../../utils/validate");
const warning_1 = require("../../../utils/warning");
const jwtFlow = new jwt_controller_1.default();
const { CLIENT_DEV, CLIENT_PRO, CLIENT_TEST, NODE_ENV } = process.env;
//userId, email, task
const sendOTP = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashOTP = yield bcrypt_1.default.hash(otp, 8);
    const newOTPVerification = new userOTPVerify_model_1.default({
        userId: data === null || data === void 0 ? void 0 : data.userId,
        otp: hashOTP,
        task: data === null || data === void 0 ? void 0 : data.task,
        createdAt: Date.now(),
        expiresAt: Date.now() + 300000
    });
    yield newOTPVerification.save();
    (0, sendEmail_1.sendOTPEmail)(data === null || data === void 0 ? void 0 : data.email, otp, data === null || data === void 0 ? void 0 : data.task);
});
class AuthController {
    registerWithEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, fullName } = req.body;
                const existedAccount = yield account_model_1.default.findOne({ email: email });
                if (existedAccount && (existedAccount === null || existedAccount === void 0 ? void 0 : existedAccount.verified) == false) {
                    yield account_model_1.default.deleteOne({ _id: existedAccount._id });
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 8);
                const newAccount = new account_model_1.default({ email: email, password: passwordHash, fullName: fullName });
                yield newAccount.save();
                let resAccount = Object.assign({}, newAccount === null || newAccount === void 0 ? void 0 : newAccount._doc);
                delete resAccount['password'];
                sendOTP({ userId: String(newAccount === null || newAccount === void 0 ? void 0 : newAccount._id), email: email, task: 'register' })
                    .then(() => {
                    res.json({ message: 'Kiểm tra email để lấy mã OTP', account: resAccount });
                    return;
                }).catch(e => {
                    (0, handleExceptions_1.default)(500, e.message, res);
                });
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.code) == 11000) {
                    (0, handleExceptions_1.default)(500, 'Tài khoản đã được đăng ký từ trước', res);
                    return;
                }
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    partnerRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, fullName, phoneNumber, description, partnerName, services, addresses, location } = req.body;
                console.log(addresses);
                if (!email || !password || !fullName || !phoneNumber || !description || !partnerName || !addresses || !location) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                if (!(0, validate_1.validatePhoneNumber)(phoneNumber)) {
                    (0, handleExceptions_1.default)(400, warning_1.phoneNumberWarn, res);
                    return;
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 8);
                const newAccount = new account_model_1.default({
                    email: email,
                    password: passwordHash,
                    phoneNumber: phoneNumber,
                    fullName: fullName,
                    description: description,
                    partnerName: partnerName,
                    services: services,
                    role: 'partner',
                    addresses: addresses,
                    location: location
                });
                yield newAccount.save();
                let resAccount = Object.assign({}, newAccount === null || newAccount === void 0 ? void 0 : newAccount._doc);
                delete resAccount['password'];
                res.json({ message: "Tài khoản đang được xét duyệt. Kết quả sẽ được gửi về email" });
            }
            catch (e) {
                // handleException(500, 'Tài khoản đã được tạo từ trước hoặc đang chờ xét duyệt', res);
                if ((e === null || e === void 0 ? void 0 : e.code) == 11000) {
                    (0, handleExceptions_1.default)(500, 'Tài khoản đã được tạo từ trước', res);
                    return;
                }
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    activeAccountWithOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                yield account_model_1.default.updateOne({ _id: userId }, { verified: true });
                yield userOTPVerify_model_1.default.deleteMany({ userId });
                res.json({ message: "Kích hoạt tài khoản thành công, đăng nhập để vào tài khoản" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, email, task } = req.body;
                console.log('resednd: ', req.body);
                if (!userId || !email || !task) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                yield userOTPVerify_model_1.default.deleteMany({ userId: userId, task: task });
                sendOTP({ userId: userId, email: email, task: task })
                    .then(() => {
                    res.json({ message: 'Kiểm tra email để lấy mã OTP' });
                    return;
                }).catch(e => {
                    (0, handleExceptions_1.default)(500, e.message, res);
                });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    loginWithEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log(email + ' ' + password);
                const account = yield account_model_1.default.findOne({ email: String(email).toLowerCase(), status: 'active', verified: true })
                    .populate('services')
                    .populate('addresses');
                if (!account) {
                    (0, handleExceptions_1.default)(400, warning_1.unregisteredAccountWarn, res);
                    return;
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, String(account.password));
                console.log(account);
                if (!passwordMatch) {
                    (0, handleExceptions_1.default)(400, warning_1.unMatchPasswordWarn, res);
                    return;
                }
                const access_token = jwtFlow.createAccessToken({ _id: account._id });
                jwtFlow.createRefreshToken({ _id: account._id }, res);
                let resAccount = Object.assign({}, account._doc);
                delete resAccount['password'];
                res.json({ message: "Đăng nhập thành công", account: Object.assign(Object.assign({}, resAccount), { access_token }) });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    sendResetPasswordEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield account_model_1.default.findOne({ email: email, verified: true });
                if (!user) {
                    (0, handleExceptions_1.default)(400, warning_1.unregisteredAccountWarn, res);
                    return;
                }
                //payload: user email
                sendOTP({ userId: user === null || user === void 0 ? void 0 : user._id, email: email, task: 'resetPassword' })
                    .then(() => {
                    res.json({ message: "Kiểm tra email để tạo mật khẩu mới", userId: user === null || user === void 0 ? void 0 : user._id });
                }).catch(e => {
                    (0, handleExceptions_1.default)(500, e.message, res);
                });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    resetPasswordWithOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, password } = req.body;
                if (!(0, validate_1.validatePassword)(password)) {
                    (0, handleExceptions_1.default)(400, warning_1.invalidPasswordWarn, res);
                    return;
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 8);
                yield account_model_1.default.updateOne({ userId: userId }, { password: passwordHash });
                yield userOTPVerify_model_1.default.deleteMany({ userId: userId, task: 'resetPassword' });
                res.json({ message: 'Tạo mật khẩu mới thành công' });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    userLogout(req, res) {
        try {
            res.clearCookie("refreshtoken", { path: "/account/refresh_token" });
            res.json({ message: "Đăng xuất thành công" });
        }
        catch (e) {
            (0, handleExceptions_1.default)(500, e.message, res);
        }
    }
}
exports.default = AuthController;
