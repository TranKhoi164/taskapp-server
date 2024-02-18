import {Router} from 'express'
import ServiceController from './service.controller'
import AccountMiddleware from '../../middlewares/account.middleware'

const serviceRoutes = Router()
const serviceController = new ServiceController()
const accountMiddleware = new AccountMiddleware()

serviceRoutes.get('/get_services', serviceController.getServices)
serviceRoutes.post("/create_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.createService)
serviceRoutes.delete("/delete_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteService)
serviceRoutes.delete("/delete_services", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteServices)


export default serviceRoutes