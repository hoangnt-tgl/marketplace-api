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
exports.checkCollectionIsConfirmService = exports.getCategoryCollectionService = exports.getBoarcCollectionIdService = exports.writeTopCollectionService = exports.getCollectionDetailService = exports.checkCollectionExistsByIdService = exports.getOneCollectionService = exports.getCollectionByIdService = exports.getCollectionsByOwnerItemsService = exports.updateVolumeTradedService = exports.checkIsBaseCollectionService = exports.checkIsOwnerOfCollectionService = exports.getTopCollectionService = exports.queryCollectionIdsInPageService = exports.getCollectionsInPageByUserService = exports.updateCollectionService = exports.checkCollectionExistsService = exports.createCollectionIfNotExistService = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const collection_model_1 = __importDefault(require("../models/collection.model"));
const model_services_1 = require("./model.services");
const model_services_2 = require("./model.services");
const other_services_1 = require("./other.services");
const history_services_1 = require("../services/history.services");
const price_services_1 = require("../services/price.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const topCollection_json_1 = __importDefault(require("../../public/topCollection.json"));
const fs_1 = __importDefault(require("fs"));
const collection_constant_1 = require("../constant/collection.constant");
const default_constant_1 = require("../constant/default.constant");
const createCollectionIfNotExistService = (userAddress, logo, background, collectionName, chainId, collectionStandard, description, royalties, category) => __awaiter(void 0, void 0, void 0, function* () {
    let queryObj;
    const collectionAddress = contract_constant_1.COLLECTION_ADDRESS[chainId];
    queryObj = { collectionAddress, collectionName, chainId };
    const check = yield checkCollectionExistsService(chainId, collectionAddress, collectionName);
    let collection;
    if (!check) {
        let newCollection = {
            collectionAddress,
            userAddress,
            logo,
            background,
            collectionName,
            chainId,
            collectionStandard,
            description,
            royalties,
            category,
        };
        collection = yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
    }
    else {
        collection = yield (0, model_services_1.findOneService)(collection_model_1.default, queryObj);
    }
    const result = returnCollectionService(collection);
    return result;
});
exports.createCollectionIfNotExistService = createCollectionIfNotExistService;
const checkCollectionExistsService = (chainId, collectionAddress, collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_2.queryExistService)(collection_model_1.default, { chainId, collectionAddress, collectionName });
});
exports.checkCollectionExistsService = checkCollectionExistsService;
const checkCollectionExistsByIdService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_2.queryExistService)(collection_model_1.default, { _id: (0, model_services_1.createObjIdService)(collectionId) });
});
exports.checkCollectionExistsByIdService = checkCollectionExistsByIdService;
const updateCollectionService = (collectionId, logo, background, description, collectionName, category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const objectQuery = { _id: (0, model_services_1.createObjIdService)(collectionId) };
        const objectUpdate = {
            logo,
            background,
            description,
            collectionName,
            category,
        };
        const collection = yield (0, model_services_1.updateOneService)(collection_model_1.default, objectQuery, objectUpdate);
        const result = returnCollectionService(collection);
        return result;
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.updateCollectionService = updateCollectionService;
const getCollectionsInPageByUserService = (userAddress, pageSize, page, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.queryItemsOfModelInPageService)(collection_model_1.default, { userAddress, chainId, collectionAddress: { $ne: process.env.BOARC_ADDRESS } }, page, pageSize);
    const returnValue = [];
    if (result) {
        for (let i = 0; i < result.data.length; i++) {
            returnValue.push(returnCollectionService(result.data[i]));
        }
        yield Promise.all(returnValue.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
            yield returnAdditionalInfoOfCollectionService(collection);
        })));
        result.data = returnValue;
        return result;
    }
    return null;
});
exports.getCollectionsInPageByUserService = getCollectionsInPageByUserService;
const queryCollectionIdsInPageService = (pageSize, page, chainId, userAddress, collectionName, collectionStandard, sort, category) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield (0, model_services_1.queryItemsOfModelInPageService)(collection_model_1.default, {
        chainId: (chainId === null || chainId === void 0 ? void 0 : chainId.length) > 0 ? chainId : undefined,
        userAddress: (userAddress === null || userAddress === void 0 ? void 0 : userAddress.length) > 0 ? userAddress : undefined,
        collectionName: (collectionName === null || collectionName === void 0 ? void 0 : collectionName.length) > 0 ? { $regex: collectionName, $options: "i" } : undefined,
        collectionStandard,
        collectionAddress: { $ne: process.env.BOARC_ADDRESS },
        category,
    }, page, pageSize, (0, other_services_1.getSortObj)(sort), "_id");
    return collections;
});
exports.queryCollectionIdsInPageService = queryCollectionIdsInPageService;
const getCollectionByIdService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    let collection = yield getOneCollectionService({ _id: (0, model_services_1.createObjIdService)(collectionId) });
    collection = returnCollectionService(collection);
    yield returnAdditionalInfoOfCollectionService(collection, false);
    return collection;
});
exports.getCollectionByIdService = getCollectionByIdService;
const getCollectionDetailService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    let collection = yield getOneCollectionService({ _id: (0, model_services_1.createObjIdService)(collectionId) });
    collection = returnCollectionService(collection);
    yield returnAdditionalInfoOfCollectionService(collection);
    return collection;
});
exports.getCollectionDetailService = getCollectionDetailService;
const getOneCollectionService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default.findOne(objQuery, properties).populate("ownerInfo");
    return collection;
});
exports.getOneCollectionService = getOneCollectionService;
const getCollectionTradeByDayService = (collectionId, fromDate, toDate) => __awaiter(void 0, void 0, void 0, function* () {
    const histories = yield (0, history_services_1.getHistoryTradeByDayService)(fromDate, toDate, {
        collectionId,
        type: 3,
    });
    let result = 0;
    histories.map((history) => {
        result += history.usdPrice;
    });
    return result;
});
const writeTopCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, { volumeTrade: { $ne: 0 }, collectionAddress: { $ne: process.env.BOARC_ADDRESS } }, "_id");
        const topCollection = {};
        yield Promise.all(collections.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
            topCollection[collection._id] = yield getCollectionDetailService(collection._id);
        })));
        fs_1.default.writeFile("../../../public/topCollection.json", JSON.stringify(topCollection), "utf8", () => {
            console.log(`Update top collection successfully at ${new Date(Date.now())}`);
        });
        // express.static(path.join(__dirname, "../../public"))
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.writeTopCollectionService = writeTopCollectionService;
const getTopCollectionService = (sortBy = "volumeTrade", sortFrom = "desc", objectQuery = {}, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    let sortable;
    if (sortFrom === "desc") {
        sortable = Object.entries(topCollection_json_1.default)
            .filter(([, value]) => {
            let result = true;
            let queryKeys = Object.keys(objectQuery);
            queryKeys.forEach((key) => {
                result = result && value[key] === objectQuery[key];
            });
            return result;
        })
            .sort(([, value1], [, value2]) => value2[sortBy] - value1[sortBy])
            .reduce((r, [k, v]) => (Object.assign(Object.assign({}, r), { [k]: v })), {});
    }
    else {
        sortable = Object.entries(topCollection_json_1.default)
            .filter(([, value]) => {
            let result = true;
            let queryKeys = Object.keys(objectQuery);
            queryKeys.forEach((key) => {
                result = result && value[key] === objectQuery[key];
            });
            return result;
        })
            .sort(([, value1], [, value2]) => value1[sortBy] - value2[sortBy])
            .reduce((r, [k, v]) => (Object.assign(Object.assign({}, r), { [k]: v })), {});
    }
    sortable = (0, other_services_1.paginateArrayService)(Object.values(sortable), pageSize, pageId);
    return sortable;
});
exports.getTopCollectionService = getTopCollectionService;
const getCategoryCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    let categories = [];
    let other;
    const LIMITED_ITEMS = Number(process.env.LIMITED_ITEMS) || 3;
    const multiProcess = collection_constant_1.CATEGORY.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
        let collection = yield collection_model_1.default
            .find({ category: obj.key, userAddress: { $ne: default_constant_1.NULL_ADDRESS } }, "_id")
            .sort({ volumeTrade: -1 })
            .limit(Number(LIMITED_ITEMS));
        if (collection.length === LIMITED_ITEMS) {
            if (obj.key === 0) {
                other = {
                    key: obj.key,
                    data: collection,
                };
            }
            else {
                categories.push({
                    key: obj.key,
                    data: collection,
                });
            }
        }
    }));
    yield Promise.all(multiProcess);
    if (other) {
        categories.push(other);
    }
    return categories;
});
exports.getCategoryCollectionService = getCategoryCollectionService;
const checkIsBaseCollectionService = (chainId, collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield getOneCollectionService({ _id: collectionId });
    return collection.collectionAddress === contract_constant_1.COLLECTION_ADDRESS[chainId].toLowerCase();
});
exports.checkIsBaseCollectionService = checkIsBaseCollectionService;
const checkIsOwnerOfCollectionService = (collectionId, userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield getOneCollectionService({ _id: collectionId });
    return (collection === null || collection === void 0 ? void 0 : collection.userAddress) === userAddress;
});
exports.checkIsOwnerOfCollectionService = checkIsOwnerOfCollectionService;
const updateVolumeTradedService = (collectionId, price) => __awaiter(void 0, void 0, void 0, function* () {
    yield collection_model_1.default.findOneAndUpdate({ _id: collectionId }, { $inc: { volumeTrade: price } });
});
exports.updateVolumeTradedService = updateVolumeTradedService;
const getCollectionsByOwnerItemsService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield (0, model_services_1.findManyService)(item_model_1.default, { owner: userAddress }, "", { createdAt: -1 });
    const extraCollections = [];
    const extra = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = yield (0, model_services_1.findOneService)(collection_model_1.default, {
            _id: item.collectionId.toString(),
            userAddress: item.owner,
        }, "_id logo collectionName");
        if (collection)
            extraCollections.push(collection);
    }));
    yield Promise.all(extra);
    const collections = [...new Map(extraCollections.map((col) => [col["_id"].toString(), col])).values()];
    const returnValue = [];
    if (collections) {
        for (let i = 0; i < collections.length; i++) {
            returnValue.push(returnCollectionService(collections[i]));
        }
    }
    return returnValue;
});
exports.getCollectionsByOwnerItemsService = getCollectionsByOwnerItemsService;
const checkCollectionIsConfirmService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield getOneCollectionService({ _id: (0, model_services_1.createObjIdService)(collectionId) });
    return collection.isConfirm;
});
exports.checkCollectionIsConfirmService = checkCollectionIsConfirmService;
const returnAdditionalInfoOfCollectionService = (collection, isDetail = true) => __awaiter(void 0, void 0, void 0, function* () {
    const countItemOfCollectionService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: (0, model_services_1.createObjIdService)(collectionId) }, "collectionId");
        const numberOfOwner = [...new Map(items.map((item) => [item["owner"], item])).values()].length;
        return {
            itemInfo: {
                items: items.length,
                owners: numberOfOwner,
            },
        };
    });
    const getFloorPriceOfCollectionService = (collection) => __awaiter(void 0, void 0, void 0, function* () {
        let listTransferHistories = yield (0, model_services_1.findManyService)(history_model_1.default, {
            collectionId: (0, model_services_1.createObjIdService)(collection.collectionId),
            type: { $eq: 3 },
        }, "price priceType");
        let priceArr = [];
        yield Promise.all(listTransferHistories.map((his) => __awaiter(void 0, void 0, void 0, function* () {
            let usdPrice = yield (0, price_services_1.changePriceService)(his.priceType, "usd", his.price);
            priceArr.push(usdPrice);
        })));
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
    const getTradeByDay = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curDay = now - 24 * 3600 * 1000;
        const lastDay = curDay - 24 * 3600 * 1000;
        const newVolume = yield getCollectionTradeByDayService(collectionId, curDay, now);
        const oldVolume = yield getCollectionTradeByDayService(collectionId, lastDay, curDay);
        return {
            day: {
                volumeTradeByDay: newVolume,
                percentByDay: oldVolume > 0 ? (newVolume - oldVolume) / oldVolume * 100 : 0,
            },
        };
    });
    const getTradeByWeek = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curWeek = now - 7 * 24 * 3600 * 1000;
        const lastWeek = curWeek - 7 * 24 * 3600 * 1000;
        const newVolume = yield getCollectionTradeByDayService(collectionId, curWeek, now);
        const oldVolume = yield getCollectionTradeByDayService(collectionId, lastWeek, curWeek);
        return {
            week: {
                volumeTradeByWeek: newVolume,
                percentByWeek: oldVolume > 0 ? (newVolume - oldVolume) / oldVolume * 100 : 0,
            },
        };
    });
    const getTradeByMonth = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
        const now = Date.now();
        const curMonth = now - 30 * 24 * 3600 * 1000;
        const lastMonth = curMonth - 30 * 24 * 3600 * 1000;
        const newVolume = yield getCollectionTradeByDayService(collectionId, curMonth, now);
        const oldVolume = yield getCollectionTradeByDayService(collectionId, lastMonth, curMonth);
        return {
            month: {
                volumeTradeByMonth: newVolume,
                percentByMonth: oldVolume > 0 ? (newVolume - oldVolume) / oldVolume * 100 : 0,
            },
        };
    });
    if (collection) {
        let username = collection.ownerInfo ? collection.ownerInfo.username : collection.userAddress;
        let userAddress = collection.ownerInfo ? collection.ownerInfo.userAddress : collection.userAddress;
        if (isDetail) {
            const obj = yield (0, other_services_1.multiProcessService)([
                getTradeByDay(collection.collectionId),
                getTradeByWeek(collection.collectionId),
                getTradeByMonth(collection.collectionId),
                countItemOfCollectionService(collection.collectionId),
                getFloorPriceOfCollectionService(collection),
            ]);
            collection["items"] = obj.itemInfo.items;
            collection["owners"] = obj.itemInfo.owners;
            collection["floorPrice"] = obj.floorPrice;
            collection["volume24Hour"] = obj.day.volumeTradeByDay;
            collection["volume7Days"] = obj.week.volumeTradeByWeek;
            collection["volume30Days"] = obj.month.volumeTradeByMonth;
            collection["percent24Hour"] = obj.day.percentByDay;
            collection["percent7Days"] = obj.week.percentByWeek;
            collection["percent30Days"] = obj.month.percentByMonth;
            collection["username"] = username !== default_constant_1.DEFAULT_NAME ? username : collection.ownerInfo.userAddress;
        }
        else {
            const obj = yield (0, other_services_1.multiProcessService)([countItemOfCollectionService(collection.collectionId)]);
            collection["items"] = obj.itemInfo.items;
            collection["username"] = username !== default_constant_1.DEFAULT_NAME ? username : userAddress;
        }
    }
});
const returnCollectionService = (collection) => {
    const returnValue = {
        collectionId: collection._id,
        collectionAddress: collection.collectionAddress,
        userAddress: collection.userAddress,
        logo: collection.logo,
        background: collection.background,
        collectionName: collection.collectionName,
        collectionStandard: collection.collectionStandard,
        royalties: collection.royalties,
        description: collection.description,
        volumeTrade: collection.volumeTrade,
        chainId: collection.chainId,
        category: collection.category,
        isConfirm: collection.isConfirm,
        ownerInfo: collection.ownerInfo,
    };
    return returnValue;
};
// BOARC
const getBoarcCollectionIdService = () => __awaiter(void 0, void 0, void 0, function* () {
    const boarc = yield getOneCollectionService({ collectionAddress: process.env.BOARC_ADDRESS }, "_id");
    if (boarc) {
        return boarc._id;
    }
    return undefined;
});
exports.getBoarcCollectionIdService = getBoarcCollectionIdService;
