import express, {Application} from 'express'

import mongoose from "mongoose";
import fileUpload from "express-fileupload"
import cors from 'cors'
import cookies from 'cookie-parser'
import accountRoutes from './resources/accountManagement/account.routes';
import uploadRoutes from './resources/uploadFile/upload.routes';
import addressRoutes from './resources/address/address.routes';
import serviceRoutes from './resources/service/service.routes';
import notificationRoutes from './resources/notification/notification.routes';
import orderRoutes from './resources/order/order.routes';

class App {
  public express: Application
  public port: Number

  constructor(port: number) {
    this.express = express()
    this.port = port 
    this.initializeMiddleware()
    this.initializeDatabaseConnection()
    this.initializeRoutes()
  }

  private initializeMiddleware() {
    if (process.env.NODE_ENV==="development") {
      this.express.use(cors({origin: process.env.CLIENT_DEV}))
    } else {
      this.express.use(cors({origin: process.env.CLIENT_PRO}))
    }
    this.express.use(cookies())
    this.express.use(fileUpload({useTempFiles: true}))
    this.express.use(express.json({limit: '2mb'}))
    this.express.use(express.urlencoded({extended: true}))
  }

  private initializeRoutes() {
    this.express.use('/notification', notificationRoutes)
    this.express.use('/account', accountRoutes)
    this.express.use('/upload', uploadRoutes)
    this.express.use('/address', addressRoutes)
    this.express.use('/service', serviceRoutes)
    this.express.use('/order', orderRoutes)
  }

  private async initializeDatabaseConnection() {
    let mongoUrl 
    if (process.env.NODE_ENV==="development") {
      mongoUrl = process.env.MONGO_DEV
    } else {
      mongoUrl = process.env.MONGO_PRO
    }
    mongoose.connect(String(mongoUrl))
    .then(() => {
      console.log('Connect to mongoDB');
    })
    .catch((err: any) => {
      throw new Error(err)
    })
  }

  public listen() {
    this.express.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    })
  }
}

export default App