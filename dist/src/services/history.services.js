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
exports.getLatestTransactionService = exports.crawlTransactionOfUserService = exports.getItemPriceChartDataService = exports.checkHistoryExistsService = exports.getManyHistoryService = exports.getOneHistoryService = exports.getHistoryTradeByDayService = exports.queryHistoryIdsInPageService = exports.createHistoryService = void 0;
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const ethers_1 = require("ethers");
const price_services_1 = require("./price.services");
const firebase_services_1 = require("./firebase.services");
const typeTransaction_constant_1 = require("../constant/typeTransaction.constant");
const item_services_1 = require("./item.services");
const user_services_1 = require("./user.services");
const collection_services_1 = require("./collection.services");
const createHistoryService = (collectionId, itemId, from, to, price, priceType, txHash, type) => __awaiter(void 0, void 0, void 0, function* () {
    const newObj = {
        collectionId: (0, model_services_1.createObjIdService)(collectionId),
        itemId: (0, model_services_1.createObjIdService)(itemId),
        from,
        to,
        price,
        priceType,
        txHash,
        type,
    };
    try {
        const history = yield (0, model_services_1.createService)(history_model_1.default, newObj);
        yield returnAdditionalHistoryService(history);
        return history;
    }
    catch (error) {
        console.log(error.message);
    }
    return null;
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
const queryHistoryIdsInPageService = (queryObj, pageId, pageSize, sortObj = { createdAt: -1 }, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield (0, model_services_1.queryItemsOfModelInPageService)(history_model_1.default, Object.assign({}, queryObj), pageId, pageSize, sortObj, properties);
    const newArr = [];
    yield Promise.all(histories.data.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        newArr[histories.data.indexOf(history)] = yield returnAdditionalHistoryService(history);
    })));
    histories.data = newArr;
    return histories;
});
exports.queryHistoryIdsInPageService = queryHistoryIdsInPageService;
const getHistoryTradeByDayService = (fromDate, toDate, objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const startDay = new Date(fromDate);
    const endDay = new Date(toDate);
    const histories = yield getManyHistoryService(Object.assign(Object.assign({}, objectQuery), { createdAt: { $gte: startDay, $lte: endDay } }));
    const runTask = histories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield (0, item_services_1.getOneItemService)({ itemId: history.itemId }, "chainId");
        history["usdPrice"] = yield (0, price_services_1.changePriceService)(history.priceType, "usd", history.price);
        history["chainId"] = item.chainId;
    }));
    yield Promise.all(runTask);
    return histories;
});
exports.getHistoryTradeByDayService = getHistoryTradeByDayService;
const getLatestTransactionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date(Date.now());
    const from = Date.now() - 4 * 24 * 60 * 60 * 1000; // 4 days
    const boarcId = yield (0, collection_services_1.getBoarcCollectionIdService)();
    const histories = yield (0, model_services_1.findManyService)(history_model_1.default, { type: 3, createdAt: { $gte: from, $lte: now }, collectionId: { $ne: boarcId } });
    yield Promise.all(histories.map(((history) => __awaiter(void 0, void 0, void 0, function* () {
        const getItemName = () => __awaiter(void 0, void 0, void 0, function* () {
            const item = yield (0, item_services_1.getOneItemService)({ _id: history.itemId });
            return { itemName: item.itemName };
        });
        const getUsername = () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, user_services_1.getOneUserService)(history.from);
            return { user: user };
        });
        const getTokenPrice = () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield (0, price_services_1.getTokenService)({ chainId: process.env.DEFAULT_CHAINID, tokenSymbol: history.priceType });
            return { tokenPrice: (0, price_services_1.fromWeiToTokenService)(history.price, token.decimal) };
        });
        const obj = yield (0, other_services_1.multiProcessService)([getItemName(), getUsername(), getTokenPrice()]);
        history["username"] = obj.user.username;
        history["avatar"] = obj.user.avatar;
        history["itemName"] = obj.itemName;
        history["tokenPrice"] = obj.tokenPrice;
    }))));
    return histories;
});
exports.getLatestTransactionService = getLatestTransactionService;
const returnAdditionalHistoryService = (history) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield (0, price_services_1.getTokenService)({ chainId: Number(process.env.DEFAULT_CHAINID), tokenSymbol: history.priceType });
        const result = (0, price_services_1.fromWeiToTokenService)(history.price, token.decimal);
        return { tokenPrice: result };
    });
    const getChainId = () => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield (0, item_services_1.getOneItemService)({ itemId: history.itemId }, "chainId");
        return { chainId: item.chainId };
    });
    const obj = {};
    yield Promise.all([getToken(), getChainId()].map((func) => __awaiter(void 0, void 0, void 0, function* () {
        func = yield func;
        let key = Object.keys(func)[0];
        let value = Object.values(func)[0];
        obj[key] = value;
    })));
    let newHis = {
        historyId: history._id,
        collectionId: history.collectionId,
        chainId: history.chainId,
        itemId: history.itemId,
        from: history.from,
        to: history.to,
        price: history.price,
        priceType: history.priceType,
        type: history.type,
        txHash: history.txHash,
        createdAt: history.createdAt,
    };
    newHis["tokenPrice"] = obj.tokenPrice;
    newHis["chainId"] = obj.chainId;
    return newHis;
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
            avgPrice: usdPrice / (reduceByDate[date].index)
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
    const userBlacklist = blacklist.reduce((arr, cur) => {
        if (!arr.includes(cur.userAddress)) {
            arr.push(cur.userAddress);
        }
        return arr;
    }, []);
    let transactionByUser = transactions.reduce((obj, cur) => {
        if (!obj[cur.from]) {
            obj[cur.from] = {
                value: cur.usdPrice,
                chainId: cur.chainId,
                reasons: typeTransaction_constant_1.TYPE_TRANSACTION[typeTransaction]
            };
        }
        else {
            obj[cur.from].value += cur.usdPrice;
        }
        return obj;
    }, {});
    transactionByUser = Object.entries(transactionByUser).filter(([key, values]) => {
        return values.value >= minValue && !userBlacklist.includes(key);
    }).reduce((r, [k, v]) => (Object.assign(Object.assign({}, r), { [k]: v })), {});
    const result = yield (0, firebase_services_1.uploadFileService)(filename, JSON.stringify(transactionByUser));
    return result;
});
exports.crawlTransactionOfUserService = crawlTransactionOfUserService;
