import { Request, Response } from "express";
import handleException from "../../utils/handleExceptions";
import { missingInforWarn } from "../../utils/warning";
import Orders from "./order.model";
import Addresses from "../address/address.model";
import OrderFeature from "./order.features";

interface ReqQuery {
  page?: number,
  sort?: number,
  status?: string,
  partner?: string
}

class OrderController { //<{}, {}, {}, ReqQuery>
  public async getOrders(req: Request, res: Response) {
    try {
      const orderService = new OrderFeature({...req.query})
      await orderService.filter()
      const orders = await orderService.query
      return res.json({message: " Thành công!", orders: orders})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  public async createOrder(req: Request, res: Response) {
    try {
      const {user, partner, userName, location, phoneNumber, email, date, service, province, userNote, district, ward, address} = req.body
      if ( !partner || !userName || !phoneNumber || !email || !date || !service || !province || !district || !ward || !address) {
        handleException(400, missingInforWarn, res)
        return
      }
      const newAddress = new Addresses({province, ward, district, address})
      await newAddress.save()
      const newOrder = new Orders({user, location, partner, userName, phoneNumber, email, date, service, address: newAddress?._id, userNote})
      await newOrder.save()
      return res.json({message: "Thành công!", order: newOrder})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  public async deleteOrder(req: Request, res: Response) {
    try {
      const {order_id} = req.params
      if (!order_id) {
        handleException(400, missingInforWarn, res)
        return
      }
      await Orders.findByIdAndDelete(order_id)
      return res.json({message: "Thành công!"})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
  public async updateOrder(req: Request, res: Response) {
    try {
      const {order_id, _id, role} = req.body
      if (!order_id) {
        handleException(400, missingInforWarn, res)
        return
      }
      console.log('update: ', req?.body);
      const update = {...req.body}

      delete update['_id']
      console.log('update: ', update);
      if (role === 'partner') {
        await Orders.updateOne({_id: order_id, partner: _id}, { $set: {...update}})
      } else {
        await Orders.updateOne({_id: order_id, user: _id}, { $set: {...update}})
      }
      
      res.json({message: "Thành công!"})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
}

export default OrderController