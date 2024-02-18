"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_middleware_1 = __importDefault(require("../../middlewares/account.middleware"));
const upload_controller_1 = __importDefault(require("./upload.controller"));
const uploadController = new upload_controller_1.default();
const accountMiddleware = new account_middleware_1.default();
const uploadRoutes = (0, express_1.Router)();
uploadRoutes.post('/upload_avatar', accountMiddleware.authCheckMiddleware, uploadController.uploadAvatar);
uploadRoutes.post('/upload_image_base64', accountMiddleware.authCheckMiddleware, uploadController.uploadImageBase64);
uploadRoutes.delete('/delete_image', accountMiddleware.authCheckMiddleware, uploadController.deleteImage);
exports.default = uploadRoutes;
