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
exports.getListCollectionService = exports.writeTopCollectionService = exports.getTopCollectionService = exports.getListCollectionByCategory = exports.getAllCollectionService = exports.checkChainIdCollectionService = exports.getNewCollectionService = void 0;
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("./model.services");
const history_services_1 = require("../services/history.services");
const other_services_1 = require("./other.services");
const fs_1 = __importDefault(require("fs"));
const getTopCollectionService = (sortBy = "volumeTrade", sortFrom, objectQuery = {}, pageSize, pageId, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    const folder = fs_1.default.readdirSync("./public");
    if (!folder.includes("topCollection.json")) {
        fs_1.default.writeFile("./public/topCollection.json", "", "utf8", () => {
            console.log(`Update top collection successfully at ${new Date(Date.now())}`);
        });
    }
    const file = fs_1.default.readFileSync("./public/topCollection.json");
    const topCollection = JSON.parse(file)[chainId];
    const sortable = Object.entries(topCollection).filter(([, value]) => {
        let result = true;
        let queryKeys = Object.keys(objectQuery);
        queryKeys.forEach((key) => {
            result = result && value[key] === objectQuery[key];
        });
        return result;
    });
    let returnValue = [];
    if (sortFrom === "desc") {
        returnValue = sortable
            .sort(([, value1], [, value2]) => value2[sortBy] - value1[sortBy])
            .reduce((r, [k, v]) => (Object.assign(Object.assign({}, r), { [k]: v })), {});
        console.log("1");
    }
    else {
        returnValue = sortable
            .sort(([, value1], [, value2]) => value1[sortBy] - value2[sortBy])
            .reduce((r, [k, v]) => (Object.assign(Object.assign({}, r), { [k]: v })), {});
    }
    const result = (0, other_services_1.paginateArrayService)(Object.values(returnValue), pageSize, pageId);
    return result;
});
exports.getTopCollectionService = getTopCollectionService;
const writeTopCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, { volumeTrade: { $ne: 0 } });
        let listChainId = collections.map(collection => collection.chainId);
        listChainId = Array.from(new Set(listChainId));
        let topCollection = {};
        yield Promise.all(listChainId.map((chainId) => __awaiter(void 0, void 0, void 0, function* () {
            let listCollection = {};
            yield Promise.all(collections.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
                if (collection.chainId == chainId) {
                    listCollection[String(collection._id)] = yield getExtraInfoCollectionService(collection._id);
                }
            })));
            topCollection[String(chainId)] = listCollection;
        })));
        fs_1.default.writeFile("./public/topCollection.json", JSON.stringify(topCollection), "utf8", () => {
            console.log(`Update top collection successfully at ${new Date(Date.now())}`);
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.writeTopCollectionService = writeTopCollectionService;
const getCollectionTradeByDayService = (collectionId, fromDate, toDate) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield (0, history_services_1.getHistoryTradeByDayService)(fromDate, toDate, {
        collectionId,
        type: 7,
    });
    let result = 0;
    histories.map((history) => {
        result += history.usdPrice;
    });
    return result;
});
const getExtraInfoCollectionService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default
        .findById(collectionId)
        .populate({ path: "ownerInfo", select: "userAddress avatar username" })
        .lean();
    //add totalItem
    let totalItem = 0;
    const countItemOfCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collectionId }, "owner itemMedia itemPreviewMedia");
        const trackItems = [];
        items.forEach((ele) => {
            trackItems.push(ele.owner);
        });
        const mergeDedupe = [...new Set([].concat(...trackItems))];
        //get total Item
        totalItem = Number(items.length);
        return {
            itemInfo: {
                items: items,
                owners: mergeDedupe.length,
            },
        };
    });
    const getFloorPriceOfCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
        let listTransferHistories = yield (0, model_services_1.findManyService)(history_model_1.default, {
            collectionId: collectionId,
            type: { $eq: 7 },
        }, "price priceType");
        let priceArr = listTransferHistories.map((his) => his.price);
        if (priceArr.length === 0) {
            return {
                floorPrice: 0,
            };
        }
        priceArr.sort((a, b) => {
            return a - b;
        });
        let minPrice = priceArr[0];
        return {
            floorPrice: (collection === null || collection === void 0 ? void 0 : collection.volumeTrade) < minPrice ? collection === null || collection === void 0 ? void 0 : collection.volumeTrade : minPrice,
        };
    });
    const getTradeByDay = () => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curDay = now - 24 * 3600 * 1000;
        const lastDay = curDay - 24 * 3600 * 1000;
        const newVolume = yield getCollectionTradeByDayService(collectionId, curDay, now);
        const oldVolume = yield getCollectionTradeByDayService(collectionId, lastDay, curDay);
        return {
            day: {
                volumeTradeByDay: newVolume,
                percentByDay: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
            },
        };
    });
    const getTradeByWeek = () => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curWeek = now - 7 * 24 * 3600 * 1000;
        const lastWeek = curWeek - 7 * 24 * 3600 * 1000;
        const newVolume = yield getCollectionTradeByDayService(collectionId, curWeek, now);
        const oldVolume = yield getCollectionTradeByDayService(collectionId, lastWeek, curWeek);
        return {
            week: {
                volumeTradeByWeek: newVolume,
                percentByWeek: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
            },
        };
    });
    const getTradeByMonth = () => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curMonth = now - 30 * 24 * 3600 * 1000;
        const lastMonth = curMonth - 30 * 24 * 3600 * 1000;
        const newVolume = yield getCollectionTradeByDayService(collectionId, curMonth, now);
        const oldVolume = yield getCollectionTradeByDayService(collectionId, lastMonth, curMonth);
        return {
            month: {
                volumeTradeByMonth: newVolume,
                percentByMonth: oldVolume > 0 ? ((newVolume - oldVolume) / oldVolume) * 100 : 0,
            },
        };
    });
    const obj = yield (0, other_services_1.multiProcessService)([
        getTradeByDay(),
        getTradeByWeek(),
        getTradeByMonth(),
        countItemOfCollectionService(),
        getFloorPriceOfCollectionService(),
    ]);
    const extraCollection = Object.assign(Object.assign({}, collection), { 
        // fix add totalItem
        listItem: obj.itemInfo.items.slice(0, totalItem), items: obj.itemInfo.items.length, owners: obj.itemInfo.owners, floorPrice: obj.floorPrice, volume24Hour: obj.day.volumeTradeByDay, volume7Days: obj.week.volumeTradeByWeek, volume30Days: obj.month.volumeTradeByMonth, percent24Hour: obj.day.percentByDay, percent7Days: obj.week.percentByWeek, percent30Days: obj.month.percentByMonth });
    return extraCollection;
});
const getNewCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date(new Date().setDate(new Date().getDate() - Number(1)));
    const collection = yield (0, model_services_1.findManyService)(collection_model_1.default, { createdAt: { $gte: date } });
    return collection;
});
exports.getNewCollectionService = getNewCollectionService;
const checkChainIdCollectionService = (id, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: id });
    if (Number(collection.chainId) === chainId) {
        return true;
    }
    else
        return false;
});
exports.checkChainIdCollectionService = checkChainIdCollectionService;
const getListCollectionService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield collection_model_1.default.find(query).lean().populate("ownerInfo");
    return collections;
});
exports.getListCollectionService = getListCollectionService;
const getAllCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, model_services_1.findManyService)(collection_model_1.default, {});
    return collection;
});
exports.getAllCollectionService = getAllCollectionService;
const getListCollectionByCategory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, query);
    return collections;
});
exports.getListCollectionByCategory = getListCollectionByCategory;
