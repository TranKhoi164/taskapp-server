"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const addressModel = new mongoose_1.default.Schema({
    address: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    }
});
const Addresses = mongoose_1.default.model("address", addressModel);
exports.default = Addresses;
