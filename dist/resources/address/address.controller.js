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
const address_model_1 = __importDefault(require("./address.model"));
const warning_1 = require("../../utils/warning");
class AddressController {
    createAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { province, ward, district, address } = req.body;
                if (!province || !ward || !district || !address) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                const newAddress = new address_model_1.default({ province, ward, district, address });
                yield newAddress.save();
                return res.json({ message: "Thành công!", address: newAddress });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    deleteAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address_id } = req.params;
                console.log('addressId: ', address_id);
                if (!address_id) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                yield address_model_1.default.findByIdAndDelete(address_id);
                return res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    createAddresses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { addresses } = req.body;
                if ((addresses === null || addresses === void 0 ? void 0 : addresses.length) == 0) {
                    (0, handleExceptions_1.default)(400, "Chưa cung cấp đủ thông tin", res);
                    return;
                }
                console.log(addresses);
                address_model_1.default.insertMany(addresses)
                    .then(docs => {
                    res.json({ message: "Thành công!", addresses: docs === null || docs === void 0 ? void 0 : docs.map(el => el === null || el === void 0 ? void 0 : el._id) });
                }).catch(e => {
                    (0, handleExceptions_1.default)(500, e.message, res);
                });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
}
exports.default = AddressController;
