"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const userOTPVerificationModel = new mongoose_1.default.Schema({
    userId: String,
    otp: String,
    task: String,
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});
const UserOTPVerification = mongoose_1.default.model("UserOtpVerification", userOTPVerificationModel);
exports.default = UserOTPVerification;
