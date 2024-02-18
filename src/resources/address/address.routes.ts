import {Router} from 'express'
import AddressController from './address.controller'
import AccountMiddleware from '../../middlewares/account.middleware'

const addressRoutes = Router()
const addressController = new AddressController()
const accountMiddleware = new AccountMiddleware()

addressRoutes.post("/create_address", addressController.createAddress)
addressRoutes.post("/create_addresses", addressController.createAddresses)
addressRoutes.delete('/delete_address/:address_id', addressController.deleteAddress)

export default addressRoutes