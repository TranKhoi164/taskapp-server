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
const cloudinary_1 = __importDefault(require("cloudinary"));
const account_model_1 = __importDefault(require("../accountManagement/model/account.model"));
const handleExceptions_1 = __importDefault(require("../../utils/handleExceptions"));
const fs_1 = __importDefault(require("fs"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
class UploadController {
    uploadAvatar(req, res) {
        var _a;
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
        if (file.size > 10e5) {
            (0, handleExceptions_1.default)(400, "File phải có kích thước dưới 1MB", res);
        }
        cloudinary_1.default.v2.uploader.upload(file === null || file === void 0 ? void 0 : file.tempFilePath, {
            folder: 'zaloTaskApp/avatar', width: 150, height: 150, crop: 'fill'
        }, (e, result) => __awaiter(this, void 0, void 0, function* () {
            if (e) {
                (0, handleExceptions_1.default)(400, e.message, res);
                return;
            }
            yield account_model_1.default.findOneAndUpdate({ _id: req.body._id }, { avatar: result.secure_url });
            console.log('result: ', result);
            res.json({ message: 'Cập nhập thành công', avatar_url: result.secure_url });
        }));
        fs_1.default.unlink(file === null || file === void 0 ? void 0 : file.tempFilePath, function (err) {
            if (err) {
                throw new Error(err);
            }
        });
    }
    uploadImageBase64(req, res) {
        // image base64
        const { image, type } = req.body;
        switch (type) {
            case 'avatar':
                cloudinary_1.default.v2.uploader.upload(image, {
                    folder: 'zaloTaskApp/avatar', height: 150, crop: 'scale'
                }, (e, result) => __awaiter(this, void 0, void 0, function* () {
                    if (e) {
                        (0, handleExceptions_1.default)(400, e.message, res);
                        return;
                    }
                    yield account_model_1.default.findOneAndUpdate({ _id: req.body._id }, { avatar: result.secure_url });
                    console.log('result: ', result);
                    res.json({ message: 'Cập nhập thành công', url: result.secure_url });
                }));
                break;
            case 'cover':
                cloudinary_1.default.v2.uploader.upload(image, {
                    folder: 'zaloTaskApp/cover', height: 150, crop: 'scale'
                }, (e, result) => __awaiter(this, void 0, void 0, function* () {
                    if (e) {
                        (0, handleExceptions_1.default)(400, e.message, res);
                        return;
                    }
                    console.log('acc:', req.body._id);
                    yield account_model_1.default.findOneAndUpdate({ _id: req.body._id }, { cover: result.secure_url });
                    console.log('result: ', result);
                    res.json({ message: 'Cập nhập thành công', url: result.secure_url });
                }));
                break;
            case 'partnerUpload':
                cloudinary_1.default.v2.uploader.upload(image, {
                    folder: 'zaloTaskApp/partnerUpload',
                }, (e, result) => __awaiter(this, void 0, void 0, function* () {
                    if (e) {
                        (0, handleExceptions_1.default)(400, e.message, res);
                        return;
                    }
                    console.log('acc:', req.body._id);
                    console.log('result: ', result);
                    res.json({ message: 'Thành công', url: result.secure_url });
                }));
            default:
                break;
        }
    }
    deleteImage(req, res) {
        const { imageName } = req.body;
        cloudinary_1.default.v2.uploader.destroy(imageName, (err, result) => {
            if (err) {
                (0, handleExceptions_1.default)(500, err.message, res);
                return;
            }
            console.log(result);
            res.json({ message: 'Thành công!' });
        });
    }
}
exports.default = UploadController;
