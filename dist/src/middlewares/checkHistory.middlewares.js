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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHistoryCanCreateMiddleware = exports.checkHistoryExistMiddleware = void 0;
const typeTransaction_constant_1 = require("../constant/typeTransaction.constant");
const history_services_1 = require("../services/history.services");
const checkHistoryExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const historyId = req.body.historyId || req.params.historyId;
    if (historyId) {
        const exist = yield (0, history_services_1.checkHistoryExistsService)({ _id: historyId });
        if (exist) {
            return next();
        }
    }
    else {
        return res.status(403).json({ error: "Missing history Id" });
    }
    return res.status(404).json({ error: "History not found" });
});
exports.checkHistoryExistMiddleware = checkHistoryExistMiddleware;
const checkHistoryCanCreateMiddleware = (req, res, next) => {
    const { type } = req.body || req.params;
    if (type) {
        if (typeTransaction_constant_1.TYPE_TRANSACTION.hasOwnProperty(parseInt(type))) {
            return next();
        }
        else {
            return res.status(403).json({ error: "Type is not valid" });
        }
    }
    else {
        return res.status(403).json({ error: "Please provide type transaction" });
    }
};
exports.checkHistoryCanCreateMiddleware = checkHistoryCanCreateMiddleware;
