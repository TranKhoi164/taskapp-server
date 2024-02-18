"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("./order.controller"));
const account_middleware_1 = __importDefault(require("../../middlewares/account.middleware"));
const orderRoutes = (0, express_1.Router)();
const orderCtrl = new order_controller_1.default;
const accountMiddleware = new account_middleware_1.default();
orderRoutes.get('/get_orders', accountMiddleware === null || accountMiddleware === void 0 ? void 0 : accountMiddleware.authCheckMiddleware, orderCtrl.getOrders);
orderRoutes.delete('/delete_order/:order_id', orderCtrl.deleteOrder);
orderRoutes.post('/create_order', orderCtrl.createOrder);
orderRoutes.patch("/update_order", accountMiddleware === null || accountMiddleware === void 0 ? void 0 : accountMiddleware.authCheckMiddleware, orderCtrl.updateOrder);
// notiRoutes.delete("/delete_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteService)
// notiRoutes.delete("/delete_services", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteServices)
exports.default = orderRoutes;
