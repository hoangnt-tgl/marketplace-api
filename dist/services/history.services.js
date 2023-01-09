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
exports.returnInfoDetailHistory = exports.crawlTransactionOfUserService = exports.getItemPriceChartDataService = exports.checkHistoryExistsService = exports.getManyHistoryService = exports.getOneHistoryService = exports.getHistoryTradeByDayService = exports.queryHistoryIdsInPageService = exports.createHistoryService = void 0;
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("./model.services");
const ethers_1 = require("ethers");
const price_services_1 = require("./price.services");
const firebase_services_1 = require("./firebase.services");
const typeTransaction_constant_1 = require("../constant/typeTransaction.constant");
const item_services_1 = require("./item.services");
const user_services_1 = require("./user.services");
const other_services_1 = require("./other.services");
const createHistoryService = (collectionId, itemId, from, to, price, priceType, quantity, txHash, type) => __awaiter(void 0, void 0, void 0, function* () {
    const newObj = {
        collectionId,
        itemId,
        from,
        to,
        price,
        priceType,
        quantity,
        txHash,
        type,
    };
    const history = yield (0, model_services_1.createService)(history_model_1.default, newObj);
    return history;
});
exports.createHistoryService = createHistoryService;
const getOneHistoryService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield (0, model_services_1.findOneService)(history_model_1.default, objQuery);
    return history;
});
exports.getOneHistoryService = getOneHistoryService;
const getManyHistoryService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield (0, model_services_1.findManyService)(history_model_1.default, objQuery);
    return histories;
});
exports.getManyHistoryService = getManyHistoryService;
const checkHistoryExistsService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(history_model_1.default, queryObj);
});
exports.checkHistoryExistsService = checkHistoryExistsService;
const queryHistoryIdsInPageService = (queryObj, pageId, pageSize, sortObj = { createdAt: -1 }) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield history_model_1.default
        .find((0, other_services_1.removeUndefinedOfObj)(queryObj), "_id txHash")
        .sort(sortObj)
        .lean();
    const historyReduce = histories.reduce((arr, cur) => {
        const index = arr.findIndex((e) => e.txHash === cur.txHash && cur.txHash !== "");
        if (index < 0) {
            arr.push({
                txHash: cur.txHash,
                histories: [cur._id],
            });
        }
        else {
            arr[index].histories.push(cur._id);
        }
        return arr;
    }, []);
    const returnHistories = (0, other_services_1.paginateArrayService)(historyReduce, pageSize, pageId);
    return returnHistories;
});
exports.queryHistoryIdsInPageService = queryHistoryIdsInPageService;
const getHistoryTradeByDayService = (fromDate, toDate, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const startDay = new Date(fromDate);
    const endDay = new Date(toDate);
    const histories = yield getManyHistoryService(Object.assign(Object.assign({}, objectQuery), { createdAt: { $gte: startDay, $lte: endDay } }));
    const tradeHistories = [];
    const runTask = histories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield (0, item_services_1.getOneItemService)({ itemId: history.itemId }, "chainId");
        const historyTrade = Object.assign(Object.assign({}, history), { usdPrice: yield (0, price_services_1.changePriceService)(history.priceType, "usd", history.price), chainId: item.chainId });
        tradeHistories.push(historyTrade);
    }));
    yield Promise.all(runTask);
    return tradeHistories;
});
exports.getHistoryTradeByDayService = getHistoryTradeByDayService;
const returnAdditionalHistoryService = (history, tokens) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const token = tokens.find(token => token.tokenSymbol === history.priceType) || { decimal: 18 };
        const result = (0, price_services_1.fromWeiToTokenService)(history.price, token.decimal);
        return { tokenPrice: result };
    });
    const getChainId = () => __awaiter(void 0, void 0, void 0, function* () {
        return { chainId: history.itemInfo.chainId };
    });
    const obj = {};
    yield Promise.all([getToken(), getChainId()].map((func) => __awaiter(void 0, void 0, void 0, function* () {
        func = yield func;
        let key = Object.keys(func)[0];
        let value = Object.values(func)[0];
        obj[key] = value;
    })));
    const extraHistory = Object.assign(Object.assign({}, history), { chainId: obj.chainId, tokenPrice: obj.tokenPrice });
    return extraHistory;
});
const getItemPriceChartDataService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield getManyHistoryService({ itemId: (0, model_services_1.createObjIdService)(itemId), type: [2, 3] });
    let index;
    const reduceByDate = histories.reduce((obj, cur) => {
        let day = cur.createdAt.getDate();
        let month = cur.createdAt.getMonth();
        let year = cur.createdAt.getFullYear();
        let date = `${year}/${month + 1}/${day}`;
        if (!obj[date]) {
            index = 0;
            obj[date] = { date: new Date(date), price: ethers_1.BigNumber.from(cur.price), priceType: cur.priceType, index };
        }
        else {
            obj[date].price = obj[date].price.add(ethers_1.BigNumber.from(cur.price));
        }
        obj[date].index += 1;
        return obj;
    }, {});
    const dates = Object.keys(reduceByDate);
    const priceChartArr = [];
    yield Promise.all(dates.map((date) => __awaiter(void 0, void 0, void 0, function* () {
        let usdPrice = yield (0, price_services_1.changePriceService)(reduceByDate[date].priceType, "usd", reduceByDate[date].price.toString());
        let data = {
            date: new Date(date + " 24:00:00"),
            avgPrice: usdPrice / reduceByDate[date].index,
        };
        priceChartArr.push(data);
    })));
    const sortedPriceChart = priceChartArr.sort((a, b) => a.date - b.date);
    return sortedPriceChart;
});
exports.getItemPriceChartDataService = getItemPriceChartDataService;
const crawlTransactionOfUserService = (filename, minValue, fromDate, toDate, typeTransaction) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield getHistoryTradeByDayService(fromDate, toDate, { type: typeTransaction });
    const blacklist = yield (0, user_services_1.getBlacklistService)();
    const type = typeTransaction.reduce((arr, t) => {
        arr.push(typeTransaction_constant_1.TYPE_TRANSACTION[t]);
        return arr;
    }, []);
    const userBlacklist = blacklist.reduce((arr, cur) => {
        if (!arr.includes(cur.userAddress)) {
            arr.push(cur.userAddress);
        }
        return arr;
    }, []);
    let totalValue = 0;
    let transactionByUser = transactions.reduce((obj, cur) => {
        if (!userBlacklist.includes(cur.from)) {
            totalValue += cur.usdPrice;
            if (!obj[cur.from]) {
                obj[cur.from] = {
                    value: cur.usdPrice,
                    chainId: cur.chainId,
                    reasons: type,
                };
            }
            else {
                obj[cur.from].value += cur.usdPrice;
            }
        }
        return obj;
    }, {});
    transactionByUser = Object.entries(transactionByUser)
        .filter(([, values]) => {
        return values.value >= minValue;
    })
        .reduce((r, [k, v]) => [...r, { [k]: v }], []);
    const result = yield (0, firebase_services_1.uploadFileToFirebaseService)(filename, JSON.stringify(transactionByUser));
    return result;
});
exports.crawlTransactionOfUserService = crawlTransactionOfUserService;
const returnInfoDetailHistory = (historyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield history_model_1.default
            .findOne({ _id: (0, model_services_1.createObjIdService)(historyId) })
            .populate({ path: "itemInfo", select: "chainId itemTokenId itemMedia itemPreviewMedia itemName" })
            .populate({ path: "fromUserInfo", select: "userAddress avatar username" })
            .populate({ path: "toUserInfo", select: "userAddress avatar username" })
            .populate({ path: "collectionInfo", select: "collectionAddress" })
            .lean();
        const tokens = yield (0, price_services_1.getManyTokenService)({ chainId: history.itemInfo.chainId });
        return returnAdditionalHistoryService(history, tokens);
    }
    catch (error) {
        console.log(error);
    }
});
exports.returnInfoDetailHistory = returnInfoDetailHistory;
