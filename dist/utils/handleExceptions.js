"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleException(status, msg, res) {
    console.log(msg);
    return res.status(status).json({ message: msg });
}
exports.default = handleException;
