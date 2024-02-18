"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
//fullName, 
const accountModel = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    cover: String,
    dateOfBirth: String,
    phoneNumber: {
        type: String,
    },
    // male, female
    gender: {
        type: String,
        default: 'male'
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dfkkrqh2s/image/upload/v1691966141/zaloTaskApp/avatar/Screenshot_2022-02-04_181853_u6m6cf_w3hnjo_itbmd4.png"
    },
    // user, admin, partner, tasker
    role: {
        type: String,
        default: 'user'
    },
    // pending, active, inactive
    status: {
        type: String,
        default: 'active'
    },
    verified: {
        type: Boolean,
        default: false,
    },
    partnerName: {
        type: String,
    },
    addresses: [
        {
            type: ObjectId,
            ref: 'address'
        }
    ],
    details: [{
            name: String,
            value: String,
        }],
    favouritePartners: [{
            type: ObjectId,
            ref: 'account',
            unique: true
        }],
    services: [{
            type: ObjectId,
            ref: 'service'
        }],
    location: [String],
    description: String,
    uploadImage: [String]
});
const Accounts = mongoose_1.default.model("account", accountModel);
exports.default = Accounts;
