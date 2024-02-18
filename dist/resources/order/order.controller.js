"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleExceptions_1 = __importDefault(require("../../utils/handleExceptions"));
const warning_1 = require("../../utils/warning");
const order_model_1 = __importDefault(require("./order.model"));
const address_model_1 = __importDefault(require("../address/address.model"));
const order_features_1 = __importDefault(require("./order.features"));
class OrderController {
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderService = new order_features_1.default(Object.assign(Object.assign({}, req.query), { partner: req.body._id }));
                yield orderService.filter();
                const orders = yield orderService.query;
                return res.json({ message: " Thành công!", orders: orders });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, partner, userName, location, phoneNumber, email, date, service, province, userNote, district, ward, address } = req.body;
                if (!user || !partner || !userName || !phoneNumber || !email || !date || !service || !province || !district || !ward || !address) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                const newAddress = new address_model_1.default({ province, ward, district, address });
                yield newAddress.save();
                const newOrder = new order_model_1.default({ user, location, partner, userName, phoneNumber, email, date, service, address: newAddress === null || newAddress === void 0 ? void 0 : newAddress._id, userNote });
                yield newOrder.save();
                return res.json({ message: "Thành công!", order: newOrder });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = req.params;
                if (!order_id) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                yield order_model_1.default.findByIdAndDelete(order_id);
                return res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id, _id } = req.body;
                if (!order_id) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                const update = req.body;
                delete update['_id'];
                console.log(update);
                yield order_model_1.default.updateOne({ _id: order_id, partner: _id }, { $set: Object.assign({}, update) });
                res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
}
exports.default = OrderController;
