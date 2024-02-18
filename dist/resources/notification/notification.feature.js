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
const notification_model_1 = __importDefault(require("./notification.model"));
const perPage_1 = require("../../utils/perPage");
class NotificationFeature {
    constructor(queryString) {
        this.queryString = queryString;
    }
    stringifyQuery(queryObj) {
        const excludedFields = ['page'];
        excludedFields.forEach((el) => delete queryObj[el]);
        return JSON.stringify(queryObj);
    }
    //only return ids
    filter() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const perPage = perPage_1.notificationsPerPage;
            const queryObj = Object.assign({}, this.queryString);
            console.log(queryObj);
            let queryStr = this.stringifyQuery(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex|in|or|elemMatch|eq)\b/g, match => '$' + match);
            console.log(perPage * (((_a = this === null || this === void 0 ? void 0 : this.queryString) === null || _a === void 0 ? void 0 : _a.page) - 1) + perPage);
            this.query = yield notification_model_1.default.find(JSON.parse(queryStr))
                .skip(perPage * (((_b = this === null || this === void 0 ? void 0 : this.queryString) === null || _b === void 0 ? void 0 : _b.page) - 1))
                .limit(perPage)
                .sort({ '_id': -1 })
                .exec();
            //.select('name sku images price minPrice maxPrice')
            return this;
        });
    }
}
exports.default = NotificationFeature;
