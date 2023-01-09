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
exports.getLatestTransactionController = exports.crawlTransactionOfUserController = exports.getItemPriceChartDataController = exports.getCollectionActivityController = exports.getListHistoriesByUserAddressController = exports.getHistoryByItemInPageController = void 0;
const history_services_1 = require("../services/history.services");
// GET Methods
const getHistoryByItemInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, pageSize, pageId } = req.params;
    const { type } = req.query;
    try {
        const history = yield (0, history_services_1.queryHistoryIdsInPageService)({ itemId, type }, parseInt(pageId), parseInt(pageSize));
        return res.status(200).json(history);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getHistoryByItemInPageController = getHistoryByItemInPageController;
const getListHistoriesByUserAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress, pageSize, pageId } = req.params;
        const listHistories = yield (0, history_services_1.queryHistoryIdsInPageService)({ $or: [{ from: userAddress }, { to: userAddress }] }, parseInt(pageId), parseInt(pageSize));
        if (listHistories) {
            return res.status(200).json(listHistories);
        }
        return res.status(400).json({ message: `Can't get list histories by user address` });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getListHistoriesByUserAddressController = getListHistoriesByUserAddressController;
const getCollectionActivityController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, pageId, pageSize } = req.params;
        const type = req.query.type;
        const histories = yield (0, history_services_1.queryHistoryIdsInPageService)({ collectionId, type }, parseInt(pageId), parseInt(pageSize));
        if (histories) {
            return res.status(200).json(histories);
        }
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot get collection activities" });
});
exports.getCollectionActivityController = getCollectionActivityController;
const getItemPriceChartDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const chart = yield (0, history_services_1.getItemPriceChartDataService)(itemId);
        return res.status(200).json(chart);
    }
    catch (error) { }
    return res.status(500).json({ error: "Can't get chart data" });
});
exports.getItemPriceChartDataController = getItemPriceChartDataController;
const getLatestTransactionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const histories = yield (0, history_services_1.getLatestTransactionService)();
        return res.status(200).json(histories);
    }
    catch (error) { }
    return res.status(500).json({ error: "Can't get latest transaction" });
});
exports.getLatestTransactionController = getLatestTransactionController;
const crawlTransactionOfUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, minValue, from, to, type } = req.body;
    if (!filename || !minValue || !from || !to || !type) {
        return res.status(400).json({ error: "Missing params" });
    }
    try {
        const result = yield (0, history_services_1.crawlTransactionOfUserService)(filename, Number(minValue), parseInt(from), parseInt(to), parseInt(type));
        if (result) {
            return res.status(200).json("Upload successful");
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Upload failed" });
});
exports.crawlTransactionOfUserController = crawlTransactionOfUserController;
