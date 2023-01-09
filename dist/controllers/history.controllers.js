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
exports.getHistoryDetailController = exports.crawlTransactionOfUserController = exports.getItemPriceChartDataController = exports.getCollectionActivityController = exports.getListHistoriesByUserAddressController = exports.getHistoryByItemInPageController = void 0;
const response_constants_1 = require("../constant/response.constants");
const history_services_1 = require("../services/history.services");
// GET Methods
const getHistoryByItemInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, pageSize, pageId } = req.params;
    const { type } = req.body;
    try {
        const history = yield (0, history_services_1.queryHistoryIdsInPageService)({ itemId, type }, parseInt(pageId), parseInt(pageSize));
        res.status(200).json(history);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getHistoryByItemInPageController = getHistoryByItemInPageController;
const getListHistoriesByUserAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, pageSize, pageId } = req.params;
        const { type } = req.body;
        const listHistories = yield (0, history_services_1.queryHistoryIdsInPageService)({ $or: [{ from: userAddress }, { to: userAddress }], type }, parseInt(pageId), parseInt(pageSize));
        if (listHistories) {
            return res.status(200).json(listHistories);
        }
        return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListHistoriesByUserAddressController = getListHistoriesByUserAddressController;
const getCollectionActivityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, pageId, pageSize } = req.params;
        const { type } = req.body;
        const histories = yield (0, history_services_1.queryHistoryIdsInPageService)({ collectionId, type }, parseInt(pageId), parseInt(pageSize));
        if (histories) {
            return res.status(200).json(histories);
        }
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getCollectionActivityController = getCollectionActivityController;
const getItemPriceChartDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const chart = yield (0, history_services_1.getItemPriceChartDataService)(itemId);
        return res.status(200).json({ data: chart });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getItemPriceChartDataController = getItemPriceChartDataController;
const crawlTransactionOfUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, minValue, fromDate, toDate, type } = req.body;
    console.log(filename, minValue, fromDate, toDate, type);
    if (!filename || !type) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    try {
        const result = yield (0, history_services_1.crawlTransactionOfUserService)(filename, minValue ? Number(minValue) : 0, fromDate ? parseInt(fromDate) : 0, toDate ? parseInt(toDate) : Date.now(), type);
        if (result) {
            return res.status(200).json("Upload successful");
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.crawlTransactionOfUserController = crawlTransactionOfUserController;
const getHistoryDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { historyId } = req.params;
        const history = yield (0, history_services_1.returnInfoDetailHistory)(historyId);
        if (history)
            return res.status(200).json({ data: history });
    }
    catch (error) {
        console.log(error.message);
    }
    res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getHistoryDetailController = getHistoryDetailController;
