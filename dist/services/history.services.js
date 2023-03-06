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
exports.getHistoryByItemService = exports.getHistoryTradeByDayService = exports.changePriceService = exports.getHistoryByUserService = exports.getMinTradeItemService = exports.getHistoryTradeByCollectionIdService = exports.getHistoryTraderByDayService = exports.getHistoryByCollectionService = exports.getManyHistoryService = void 0;
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("./model.services");
const item_services_1 = require("./item.services");
const changePrice_services_1 = require("./changePrice.services");
const getManyHistoryService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield history_model_1.default
        .find(objQuery)
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "fromUserInfo" })
        .populate({ path: "collectionInfo" })
        .sort({ createdAt: -1 });
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
        .find(Object.assign({ itemId }, objectQuery))
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "fromUserInfo" })
        .populate({ path: "collectionInfo" })
        .sort({ createdAt: -1 });
    return histories;
});
exports.getHistoryByItemService = getHistoryByItemService;
const getHistoryByCollectionService = (collectionId, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = history_model_1.default
        .find(Object.assign({ collectionId }, objectQuery))
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "fromUserInfo" })
        .populate({ path: "collectionInfo" })
        .sort({ createdAt: -1 });
    return histories;
});
exports.getHistoryByCollectionService = getHistoryByCollectionService;
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
const getHistoryTradeByCollectionIdService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield (0, model_services_1.findManyService)(history_model_1.default, { collectionId, type: 7 });
    let sum = 0;
    yield Promise.all(history.map((historys) => __awaiter(void 0, void 0, void 0, function* () {
        sum = sum + Number(historys.price);
    })));
    return sum;
});
exports.getHistoryTradeByCollectionIdService = getHistoryTradeByCollectionIdService;
const getMinTradeItemService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    let minTradeItem = [];
    const history = yield (0, model_services_1.findManyService)(history_model_1.default, { collectionId, type: 6 });
    let minTrade = Math.min(...history.map((historys) => Number(historys.price)));
    let result = history.filter(history => Number(history.price) === Number(minTrade));
    // await Promise.all(
    result.map((historys) => {
        const itemIdMinTrade = historys.itemId.toString();
        const minValueTradeItem = Number(historys.price);
        minTradeItem.push({ itemIdMinTrade: itemIdMinTrade, minTradeItem: minValueTradeItem });
        console.log(minTradeItem);
    });
    return minTradeItem;
});
exports.getMinTradeItemService = getMinTradeItemService;
const getHistoryByUserService = (from, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = history_model_1.default
        .find({ from })
        .lean()
        .populate({ path: "itemInfo" })
        .populate({ path: "fromUserInfo" })
        .populate({ path: "collectionInfo" })
        .sort({ createdAt: -1 });
    return histories;
});
exports.getHistoryByUserService = getHistoryByUserService;
const changePriceService = () => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield (0, model_services_1.findManyService)(history_model_1.default, {});
    const runTask = history.map((historys) => __awaiter(void 0, void 0, void 0, function* () {
        const priceChange = yield (0, changePrice_services_1.changePricetoUSD)(historys.priceType.toString(), Number(historys.price));
        const priceTypeChange = "USD";
        yield (0, model_services_1.updateOneService)(history_model_1.default, { _id: historys._id }, { price: priceChange, priceType: priceTypeChange });
    }));
    yield Promise.all(runTask);
});
exports.changePriceService = changePriceService;
