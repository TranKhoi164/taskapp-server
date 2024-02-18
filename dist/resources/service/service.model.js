"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Schema.Types;
const serviceModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
    }
});
const Services = mongoose_1.default.model("service", serviceModel);
exports.default = Services;
