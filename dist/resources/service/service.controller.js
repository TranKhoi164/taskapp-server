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
const service_model_1 = __importDefault(require("./service.model"));
const warning_1 = require("../../utils/warning");
class ServiceController {
    getServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield service_model_1.default.find({});
                return res.json({ services: services });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    createService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                const newService = new service_model_1.default({ name });
                yield newService.save();
                return res.json({ message: "Thành công!", service: newService });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, 'Dịch vụ đã tồn tại', res);
            }
        });
    }
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.body;
                if (!serviceId) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                yield service_model_1.default.deleteOne({ _id: serviceId });
                return res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    deleteServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { servicesId } = req.body;
                if (!servicesId) {
                    (0, handleExceptions_1.default)(400, warning_1.missingInforWarn, res);
                    return;
                }
                yield service_model_1.default.deleteMany({ _id: { $in: servicesId } });
                return res.json({ message: "Thành công!" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
}
exports.default = ServiceController;
