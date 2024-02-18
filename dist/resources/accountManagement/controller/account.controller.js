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
const account_model_1 = __importDefault(require("../model/account.model"));
const handleExceptions_1 = __importDefault(require("../../../utils/handleExceptions"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const account_features_1 = __importDefault(require("./account.features"));
const sendEmail_1 = require("../../../utils/sendEmail");
class AccountController {
    getAccountInfor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                }
                else {
                    account_model_1.default.findOne({ _id: user_id })
                        .populate("services")
                        .populate("addresses")
                        .select("-password")
                        .clone()
                        .then((account) => {
                        res.json({ account });
                    })
                        .catch((e) => {
                        if (e) {
                            (0, handleExceptions_1.default)(400, e.message, res);
                            return;
                        }
                    });
                }
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    getAccountsInfor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const accountFeature = new account_features_1.default(req.query);
                yield accountFeature.filter();
                const partners = accountFeature.query;
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
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    getVerifiedPartners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                account_model_1.default.find({ role: "partner", verified: true })
                    .populate("services")
                    .populate("addresses")
                    .select("-password")
                    .clone()
                    .then((partners) => {
                    res.json({ partners: partners });
                })
                    .catch((e) => {
                    if (e) {
                        (0, handleExceptions_1.default)(400, e.message, res);
                        return;
                    }
                });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    getUnverifiedPartners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                account_model_1.default.find({ role: "partner", verified: false })
                    .populate("services")
                    .select("-password")
                    .clone()
                    .then((partners) => {
                    res.json({ partners: partners });
                })
                    .catch((e) => {
                    if (e) {
                        (0, handleExceptions_1.default)(400, e.message, res);
                        return;
                    }
                });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    verifyPartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerId, partnerEmail } = req.body;
                console.log(partnerEmail);
                yield account_model_1.default.updateOne({ _id: partnerId, role: "partner" }, { verified: true });
                (0, sendEmail_1.sendOTPEmail)(partnerEmail, "", "verifyPartner");
                res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    cancelVerificationPartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerId, partnerEmail } = req.body;
                console.log(partnerEmail);
                yield account_model_1.default.updateOne({ _id: partnerId, role: "partner" }, { verified: false });
                (0, sendEmail_1.sendOTPEmail)(partnerEmail, "", "unverifyPartner");
                res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    deletePartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerId, partnerEmail } = req.body;
                console.log(partnerEmail);
                yield account_model_1.default.deleteOne({ _id: partnerId, role: "partner" });
                (0, sendEmail_1.sendOTPEmail)(partnerEmail, "", "deletePartner");
                res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    updateAccountBasicInfor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountUpdate = req.body;
                console.log(accountUpdate);
                yield account_model_1.default.findOneAndUpdate({ _id: req.body._id }, Object.assign({}, accountUpdate));
                res.json({ message: "Cập nhật thông tin thành công" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    updateAccountPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newPassword } = req.body;
                const passwordHash = yield bcrypt_1.default.hash(newPassword, 8);
                yield account_model_1.default.findOneAndUpdate({ _id: req.body._id }, { password: passwordHash });
                res.json({ message: "Cập nhật mật khẩu thành công" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    getFavouritePartners(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = req.params;
                const account = yield account_model_1.default.findById(user_id).populate({
                    path: "favouritePartners",
                    populate: {
                        path: "services",
                    },
                    select: "avatar partnerName location cover",
                });
                res.json({
                    favourite_partners: (_a = account === null || account === void 0 ? void 0 : account._doc) === null || _a === void 0 ? void 0 : _a.favouritePartners,
                    message: "Thành công",
                });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
}
exports.default = AccountController;
