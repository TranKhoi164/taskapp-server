import { Router } from "express";
import AccountMiddleware from "../../middlewares/account.middleware";
import UploadController from "./upload.controller";

const uploadController = new UploadController()
const accountMiddleware = new AccountMiddleware()

const uploadRoutes = Router()

uploadRoutes.post('/upload_avatar', accountMiddleware.authCheckMiddleware, uploadController.uploadAvatar)
uploadRoutes.post('/upload_image_base64', accountMiddleware.authCheckMiddleware, uploadController.uploadImageBase64)
uploadRoutes.delete('/delete_image', accountMiddleware.authCheckMiddleware, uploadController.deleteImage) 

export default uploadRoutes