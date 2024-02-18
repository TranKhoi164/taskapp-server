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
exports.NotiFunc = void 0;
const handleExceptions_1 = __importDefault(require("../../utils/handleExceptions"));
const notification_model_1 = __importDefault(require("./notification.model"));
const notification_feature_1 = __importDefault(require("./notification.feature"));
class NotiFunc {
    constructor(noti) {
        this.noti = noti;
    }
    //title, body, sender, receiver, to
    createNotification() {
        const newNoti = new notification_model_1.default(Object.assign({}, this.noti));
        newNoti.save();
    }
}
exports.NotiFunc = NotiFunc;
class NotificationController {
    getNotification(req, res) {
        try {
            const { notification_id } = req.params;
            console.log(notification_id);
            notification_model_1.default.findOne({ _id: notification_id }, (err, noti) => {
                res.json({ notification: noti });
            });
        }
        catch (e) {
            (0, handleExceptions_1.default)(500, e.message, res);
        }
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationService = new notification_feature_1.default(req.query);
                yield notificationService.filter();
                const notifications = yield notificationService.query;
                res.json({ notifications: notifications });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
    createNotification(req, res) {
        try {
            const nofiFunc = new NotiFunc(req.body);
            nofiFunc.createNotification();
            res.json({ message: "Thành công" });
        }
        catch (e) {
            (0, handleExceptions_1.default)(500, e.message, res);
        }
    }
    updateNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = req.body;
                const updateInfor = req.body;
                updateInfor === null || updateInfor === void 0 ? true : delete updateInfor.ids;
                yield notification_model_1.default.updateMany({ _id: { $in: [...ids] } }, { $set: { isSeen: true } });
                res.json({ message: "Thành công" });
            }
            catch (e) {
                (0, handleExceptions_1.default)(500, e.message, res);
            }
        });
    }
}
exports.default = NotificationController;
