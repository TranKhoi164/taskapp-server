"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = __importDefault(require("./address.controller"));
const account_middleware_1 = __importDefault(require("../../middlewares/account.middleware"));
const addressRoutes = (0, express_1.Router)();
const addressController = new address_controller_1.default();
const accountMiddleware = new account_middleware_1.default();
addressRoutes.post("/create_address", addressController.createAddress);
addressRoutes.post("/create_addresses", addressController.createAddresses);
addressRoutes.delete('/delete_address/:address_id', addressController.deleteAddress);
exports.default = addressRoutes;
