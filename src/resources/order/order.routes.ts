import {Router} from 'express'
import OrderController from './order.controller'
import AccountMiddleware from '../../middlewares/account.middleware'

const orderRoutes = Router()
const orderCtrl = new OrderController
const accountMiddleware = new AccountMiddleware()

orderRoutes.get('/get_orders', accountMiddleware?.authCheckMiddleware, orderCtrl.getOrders)
orderRoutes.delete('/delete_order/:order_id', orderCtrl.deleteOrder)
orderRoutes.post('/create_order', orderCtrl.createOrder)
orderRoutes.patch("/update_order", accountMiddleware?.authCheckMiddleware, orderCtrl.updateOrder)

// notiRoutes.delete("/delete_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteService)
// notiRoutes.delete("/delete_services", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteServices)


export default orderRoutes