import cloudinary from 'cloudinary'
import { Request, Response } from 'express'
import fileUpload = require('express-fileupload')
import Accounts from '../accountManagement/model/account.model'
import handleException from '../../utils/handleExceptions'
import fs from 'fs'

type FileArray = fileUpload.FileArray
type UploadedFile = fileUpload.UploadedFile
type Options = fileUpload.Options;

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

class UploadController {
  uploadAvatar(req: Request, res: Response): void {
    const file = req.files?.file as fileUpload.UploadedFile

    if (file.size > 10e5) {
      handleException(400, "File phải có kích thước dưới 1MB", res)
    }

    cloudinary.v2.uploader.upload(file?.tempFilePath, {
      folder: 'zaloTaskApp/avatar', width: 150, height: 150, crop: 'fill'
    }, async (e: any, result: any) => {
      if (e) {
        handleException(400, e.message, res)
        return
      }

      await Accounts.findOneAndUpdate({_id: req.body._id}, {avatar: result.secure_url})
      console.log('result: ', result);
      res.json({message: 'Cập nhập thành công', avatar_url: result.secure_url})
    })
    fs.unlink(file?.tempFilePath, function(err: any) {
      if (err) {
        throw new Error(err)
      }
    })
  }

  uploadImageBase64(req: Request, res: Response): void {
    // image base64
    const {image, type} = req.body

    switch (type) {
      case 'avatar':
        cloudinary.v2.uploader.upload(image, {
          folder: 'zaloTaskApp/avatar', height: 150, crop: 'scale'
        }, async (e: any, result: any) => {
          if (e) {
            handleException(400, e.message, res)
            return
          }
          await Accounts.findOneAndUpdate({_id: req.body._id}, {avatar: result.secure_url})
          console.log('result: ', result);
          res.json({message: 'Cập nhập thành công', url: result.secure_url})
        })
        break;

      case 'cover': 
        cloudinary.v2.uploader.upload(image, {
          folder: 'zaloTaskApp/cover', 
        }, async (e: any, result: any) => {
          if (e) {
            handleException(400, e.message, res)
            return
          }
          console.log('acc:',req.body._id);
          await Accounts.findOneAndUpdate({_id: req.body._id}, {cover: result.secure_url})
          console.log('result: ', result);
          res.json({message: 'Cập nhập thành công', url: result.secure_url})
        })
        break;

      case 'partnerUpload': 
        cloudinary.v2.uploader.upload(image, {
          folder: 'zaloTaskApp/partnerUpload',
        }, async (e: any, result: any) => {
          if (e) {
            handleException(400, e.message, res)
            return
          }
          console.log('acc:',req.body._id);
          console.log('result: ', result);
          res.json({message: 'Thành công', url: result.secure_url})
        })
      default:
        break;
    }
  }

  deleteImage(req: Request, res: Response):void {
    const {imageName} = req.body

    cloudinary.v2.uploader.destroy(imageName, (err: any, result: any) => {
      if (err) {
        handleException(500, err.message, res)
        return
      }
      console.log(result);
      res.json({message: 'Thành công!'})
    }) 
  }
}

export default UploadController