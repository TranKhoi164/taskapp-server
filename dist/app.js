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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const account_routes_1 = __importDefault(require("./resources/accountManagement/account.routes"));
const upload_routes_1 = __importDefault(require("./resources/uploadFile/upload.routes"));
const address_routes_1 = __importDefault(require("./resources/address/address.routes"));
const service_routes_1 = __importDefault(require("./resources/service/service.routes"));
const notification_routes_1 = __importDefault(require("./resources/notification/notification.routes"));
const order_routes_1 = __importDefault(require("./resources/order/order.routes"));
class App {
    constructor(port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initializeMiddleware();
        this.initializeDatabaseConnection();
        this.initializeRoutes();
    }
    initializeMiddleware() {
        if (process.env.NODE_ENV === "development") {
            this.express.use((0, cors_1.default)({ origin: process.env.CLIENT_DEV }));
        }
        else if (process.env.NODE_ENV === "testing") {
            this.express.use((0, cors_1.default)({ origin: process.env.CLIENT_TEST }));
        }
        else {
            this.express.use((0, cors_1.default)({ origin: process.env.CLIENT_PRO }));
        }
        this.express.use((0, cookie_parser_1.default)());
        this.express.use((0, express_fileupload_1.default)({ useTempFiles: true }));
        this.express.use(express_1.default.json({ limit: '2mb' }));
        this.express.use(express_1.default.urlencoded({ extended: true }));
    }
    initializeRoutes() {
        this.express.use('/', (req, res) => {
            res.json({ message: 'deploy successfully' });
        });
        this.express.use('/notification', notification_routes_1.default);
        this.express.use('/account', account_routes_1.default);
        this.express.use('/upload', upload_routes_1.default);
        this.express.use('/address', address_routes_1.default);
        this.express.use('/service', service_routes_1.default);
        this.express.use('/order', order_routes_1.default);
    }
    initializeDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            let mongoUrl;
            if (process.env.NODE_ENV === "development") {
                mongoUrl = process.env.MONGO_DEV;
            }
            else {
                mongoUrl = process.env.MONGO_PRO;
            }
            mongoose_1.default.connect(String(mongoUrl))
                .then(() => {
                console.log('Connect to mongoDB');
            })
                .catch((err) => {
                throw new Error(err);
            });
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
exports.default = App;
