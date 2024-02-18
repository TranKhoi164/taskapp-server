"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const notificationModel = new mongoose_1.default.Schema({
    title: String,
    body: String,
    sender: {
        type: ObjectId,
        ref: 'account'
    },
    roleOfReceiver: String,
    to: {
        type: ObjectId,
        ref: 'account'
    },
    isSeen: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});
const Notifications = mongoose_1.default.model("notification", notificationModel);
exports.default = Notifications;
