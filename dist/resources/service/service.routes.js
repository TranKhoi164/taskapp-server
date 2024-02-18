"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = __importDefault(require("./service.controller"));
const account_middleware_1 = __importDefault(require("../../middlewares/account.middleware"));
const serviceRoutes = (0, express_1.Router)();
const serviceController = new service_controller_1.default();
const accountMiddleware = new account_middleware_1.default();
serviceRoutes.get('/get_services', serviceController.getServices);
serviceRoutes.post("/create_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.createService);
serviceRoutes.delete("/delete_service", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteService);
serviceRoutes.delete("/delete_services", accountMiddleware.authCheckMiddleware, accountMiddleware.authAdminMiddleware, serviceController.deleteServices);
exports.default = serviceRoutes;
