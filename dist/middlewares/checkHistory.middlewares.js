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
const response_constants_1 = require("../constant/response.constants");
const typeTransaction_constant_1 = require("../constant/typeTransaction.constant");
const history_services_1 = require("../services/history.services");
const checkHistoryExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const historyId = req.body.historyId || req.params.historyId;
        if (!historyId) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const exist = yield (0, history_services_1.checkHistoryExistsService)({ _id: historyId });
        if (!exist) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkHistoryExistMiddleware = checkHistoryExistMiddleware;
const checkHistoryCanCreateMiddleware = (req, res, next) => {
    try {
        const { type } = req.body || req.params;
        if (!type) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (!typeTransaction_constant_1.TYPE_TRANSACTION.hasOwnProperty(parseInt(type))) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
};
exports.checkHistoryCanCreateMiddleware = checkHistoryCanCreateMiddleware;
