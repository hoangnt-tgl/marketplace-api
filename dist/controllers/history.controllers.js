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
exports.getHistoryByItemId = exports.changePrice = exports.getHistoryByCollection = exports.getHistoryByUser = void 0;
const response_constants_1 = require("../constant/response.constants");
const changePrice_services_1 = require("../services/changePrice.services");
const history_services_1 = require("../services/history.services");
const getHistoryByItemId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { itemId } = req.params;
        let history = yield (0, history_services_1.getHistoryByItemService)(itemId, {});
        return res.status(200).json({ data: history });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getHistoryByItemId = getHistoryByItemId;
const getHistoryByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.params;
        let history = yield (0, history_services_1.getHistoryByUserService)(userAddress, {});
        return res.status(200).json({ data: history });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getHistoryByUser = getHistoryByUser;
const getHistoryByCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { collectionId } = req.params;
        let history = yield (0, history_services_1.getManyHistoryService)({ collectionId });
        return res.status(200).json({ data: history });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getHistoryByCollection = getHistoryByCollection;
const changePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fsyms } = req.query;
        if (fsyms === undefined)
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        let s = fsyms.toString();
        const result = yield (0, changePrice_services_1.changePricetoUSD)(s, 1);
        return res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.changePrice = changePrice;
