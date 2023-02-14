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
exports.getHistoryByItemService = exports.getHistoryTradeByDayService = exports.getHistoryByUserService = exports.getHistoryTraderByDayService = exports.getManyHistoryService = void 0;
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("./model.services");
const item_services_1 = require("./item.services");
const getManyHistoryService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield (0, model_services_1.findManyService)(history_model_1.default, objQuery);
    return histories;
});
exports.getManyHistoryService = getManyHistoryService;
const DEFAULT_CHAINID = process.env.DEFAULT_CHAINID || "2";
const getHistoryTradeByDayService = (fromDate, toDate, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const startDay = new Date(fromDate);
    const endDay = new Date(toDate);
    const histories = yield (0, exports.getManyHistoryService)(Object.assign(Object.assign({}, objectQuery), { createdAt: { $gte: startDay, $lte: endDay } }));
    const tradeHistories = [];
    const runTask = histories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield (0, item_services_1.getOneItemService)({ itemId: history.itemId }, "chainId");
        const historyTrade = Object.assign(Object.assign({}, history), { usdPrice: Number(history.price), chainId: (item === null || item === void 0 ? void 0 : item.chainId) || DEFAULT_CHAINID });
        tradeHistories.push(historyTrade);
    }));
    yield Promise.all(runTask);
    return tradeHistories;
});
exports.getHistoryTradeByDayService = getHistoryTradeByDayService;
const getHistoryByItemService = (itemId, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = history_model_1.default
        .find({ itemId })
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "fromUserInfo" })
        .sort({ createdAt: -1 });
    return histories;
});
exports.getHistoryByItemService = getHistoryByItemService;
const getHistoryTraderByDayService = (fromDate, toDate, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const startDay = new Date(fromDate);
    const endDay = new Date(toDate);
    const histories = yield (0, exports.getManyHistoryService)(Object.assign(Object.assign({}, objectQuery), { createdAt: { $gte: startDay, $lte: endDay } }));
    const traderHistories = [];
    const runTask = histories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield (0, item_services_1.getOneItemService)({ itemId: history.itemId }, "chainId");
        const historyTrade = Object.assign(Object.assign({}, history), { usdPrice: Number(history.price), chainId: (item === null || item === void 0 ? void 0 : item.chainId) || DEFAULT_CHAINID });
        traderHistories.push(historyTrade);
    }));
    yield Promise.all(runTask);
    return traderHistories;
});
exports.getHistoryTraderByDayService = getHistoryTraderByDayService;
const getHistoryByUserService = (from, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = history_model_1.default
        .find({ from })
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "fromUserInfo" })
        .sort({ createdAt: -1 });
    return histories;
});
exports.getHistoryByUserService = getHistoryByUserService;
