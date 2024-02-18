"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("./notification.controller"));
const account_middleware_1 = __importDefault(require("../../middlewares/account.middleware"));
const notificationRoutes = (0, express_1.Router)();
const notiCtrl = new notification_controller_1.default();
const accountMiddleware = new account_middleware_1.default();
notificationRoutes.get('/get_notification/:notification_id', notiCtrl.getNotification);
notificationRoutes.get('/get_notifications', accountMiddleware.authCheckMiddleware, notiCtrl.getNotifications);
notificationRoutes.post("/create_notification", notiCtrl.createNotification);
notificationRoutes.post("/update_notifications", notiCtrl.updateNotifications);
// notiRoutes.delete("/delete_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteService)
// notiRoutes.delete("/delete_services", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteServices)
exports.default = notificationRoutes;
