import {Router} from 'express'
import NotificationController from './notification.controller'
import AccountMiddleware from '../../middlewares/account.middleware'

const notificationRoutes = Router()
const notiCtrl = new NotificationController()
const accountMiddleware = new AccountMiddleware()

notificationRoutes.get('/get_notification/:notification_id', notiCtrl.getNotification)
notificationRoutes.get('/get_notifications', accountMiddleware.authCheckMiddleware, notiCtrl.getNotifications)
notificationRoutes.post("/create_notification", notiCtrl.createNotification)
notificationRoutes.post("/update_notifications", notiCtrl.updateNotifications)

// notiRoutes.delete("/delete_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteService)
// notiRoutes.delete("/delete_services", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteServices)


export default notificationRoutes