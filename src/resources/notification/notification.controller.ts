import { Request, Response, RequestHandler } from "express";
import handleException from "../../utils/handleExceptions";
import Notifications from "./notification.model";
import NotificationFeature from "./notification.feature";

type ReqQuery = {
  page?: number
  sort?: number
  role?: string
}

export class NotiFunc {
  noti: any;

  constructor(noti: any) {
    this.noti = noti;
  }
  //title, body, sender, receiver, to
  createNotification() {
    const newNoti = new Notifications({ ...this.noti });
    newNoti.save();
  }
}

class NotificationController  {
  getNotification(req: Request, res: Response) {
    try {
      const {notification_id} = req.params
      console.log(notification_id);
      Notifications.findOne({_id: notification_id}, (err: any, noti: any) => {
        res.json({notification: noti})
      })
    } catch(e: any) {
      handleException(500, e.message, res)
    }
  }

  async getNotifications(req: Request<{}, {}, {}, ReqQuery>, res: Response) {
    try {
      const notificationService = new NotificationFeature(req.query)
      await notificationService.filter()
      const notifications = await notificationService.query

      res.json({notifications: notifications})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
  createNotification(req: Request, res: Response) {
    try {
      const nofiFunc = new NotiFunc(req.body);
      nofiFunc.createNotification();
      res.json({ message: "Thành công" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }
  async updateNotifications(req: Request, res: Response) {
    try {
      const {ids} = req.body
      const updateInfor = req.body
      delete updateInfor?.ids
      await Notifications.updateMany({_id: {$in: [...ids]}}, {$set: {isSeen: true}})
      res.json({ message: "Thành công" });
    } catch (e: any) {
      handleException(500, e.message, res);
    }
  }
}

export default NotificationController;
