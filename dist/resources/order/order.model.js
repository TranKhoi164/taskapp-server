"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const orderModel = new mongoose_1.default.Schema({
    user: {
        type: ObjectId,
        ref: 'account',
    },
    partner: {
        type: ObjectId,
        ref: 'account',
        required: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    service: {
        type: ObjectId,
        ref: 'service',
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    userNote: {
        type: String,
    },
    address: {
        type: ObjectId,
        ref: 'address',
        required: true,
    },
    status: {
        type: String,
        default: 'await' // active || complete || inactive
    },
    location: {
        type: String,
        required: true
    },
    partnerNote: {
        type: String,
    }
}, { timestamps: true });
orderModel.index({ userName: 'text' });
const Orders = mongoose_1.default.model("order", orderModel);
exports.default = Orders;
