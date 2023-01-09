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
exports.updateTotalItem = exports.createCollection = exports.updateTotalItemService = exports.getUserAddressCollection = exports.updateCollectionInfo = exports.createCollectionInfo = exports.getCollectionIdInfoService = exports.getCollectionDropp = exports.getListCollectionsByCategoryService = exports.getCollectionCardService = exports.getExtraInfoCollectionService = exports.getLessInfoCollectionService = exports.getCollectionBoxERC1155Service = exports.getCollectionAssetERC1155Service = exports.getBoarcDropCollectionService = exports.getCollectionBoxService = exports.getAllCollectionsService = exports.getBoxCollectionIdService = exports.querySearchCollectionService = exports.checkCollectionIsConfirmService = exports.getCategoryCollectionService = exports.writeTopCollectionService = exports.getCollectionDetailService = exports.checkCollectionExistsByIdService = exports.getOneCollectionService = exports.getCollectionByIdService = exports.getCollectionsByOwnerItemsService = exports.updateVolumeTradedService = exports.checkIsBaseCollectionService = exports.checkIsOwnerOfCollectionService = exports.getTopCollectionService = exports.queryCollectionIdsInPageService = exports.updateCollectionService = exports.checkCollectionExistsService = exports.createCollectionIfNotExistService = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const collection_model_1 = __importDefault(require("../models/collection.model"));
const model_services_1 = require("./model.services");
const model_services_2 = require("./model.services");
const other_services_1 = require("./other.services");
const history_services_1 = require("../services/history.services");
const price_services_1 = require("../services/price.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
/*------------@Dev:Huy-----------------*/
const collectionInfo_model_1 = __importDefault(require("../models/collectionInfo.model"));
const fs_1 = __importDefault(require("fs"));
const collection_constant_1 = require("../constant/collection.constant");
const default_constant_1 = require("../constant/default.constant");
const item_services_1 = require("../services/item.services");
const createCollectionIfNotExistService = (userAddress, logo, background, collectionName, chainId, collectionStandard, description, royalties, category) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionAddress = contract_constant_1.MetaSpacecyAssetShared[chainId];
    const queryObj = { collectionAddress, collectionName, chainId };
    const check = yield checkCollectionExistsService(chainId, collectionAddress, collectionName);
    const newCollection = {
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
    const collection = check
        ? yield (0, model_services_1.findOneService)(collection_model_1.default, queryObj)
        : yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
    return collection;
});
exports.createCollectionIfNotExistService = createCollectionIfNotExistService;
const checkCollectionExistsService = (chainId, collectionAddress, collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_2.queryExistService)(collection_model_1.default, { chainId, collectionAddress, collectionName });
    return result;
});
exports.checkCollectionExistsService = checkCollectionExistsService;
const checkCollectionExistsByIdService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_2.queryExistService)(collection_model_1.default, { _id: (0, model_services_1.createObjIdService)(collectionId) });
    return result;
});
exports.checkCollectionExistsByIdService = checkCollectionExistsByIdService;
const updateCollectionService = (collectionId, logo, background, description, collectionName, category) => __awaiter(void 0, void 0, void 0, function* () {
    const objectQuery = { _id: (0, model_services_1.createObjIdService)(collectionId) };
    const objectUpdate = {
        logo,
        background,
        description,
        collectionName,
        category,
    };
    const collection = yield (0, model_services_1.updateOneService)(collection_model_1.default, objectQuery, objectUpdate);
    return collection;
});
exports.updateCollectionService = updateCollectionService;
const getListCollectionsByCategoryService = (typeCategory, pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, { category: typeCategory }, "_id");
    const returnCollections = (0, other_services_1.paginateArrayService)(collections, pageSize, pageId);
    return returnCollections;
});
exports.getListCollectionsByCategoryService = getListCollectionsByCategoryService;
const queryCollectionIdsInPageService = (pageSize, page, chainId, userAddress = "", collectionName = "", collectionStandard = "", sort = [], category) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, model_services_1.queryItemsOfModelInPageService)(collection_model_1.default, {
        chainId: chainId && chainId.length > 0 ? chainId : undefined,
        userAddress: userAddress ? userAddress : undefined,
        collectionName: collectionName ? { $regex: collectionName, $options: "i" } : undefined,
        collectionStandard: collectionStandard ? collectionStandard : undefined,
        isINO: userAddress ? undefined : false,
        category: category && category.length > 0 ? category : undefined,
    }, page, pageSize, (0, other_services_1.getSortObj)(sort), "_id");
    return response;
});
exports.queryCollectionIdsInPageService = queryCollectionIdsInPageService;
const querySearchCollectionService = (text, pageSize, page, sort) => __awaiter(void 0, void 0, void 0, function* () {
    const objQuery = {
        $or: [{ collectionAddress: { $regex: text, $options: "i" } }, { collectionName: { $regex: text, $options: "i" } }],
    };
    const collections = yield (0, model_services_1.queryItemsOfModelInPageService)(collection_model_1.default, Object.assign(Object.assign({}, objQuery), { collectionAddress: { $ne: process.env.BOARC_ADDRESS } }), page, pageSize, (0, other_services_1.getSortObj)(sort), "_id");
    return collections;
});
exports.querySearchCollectionService = querySearchCollectionService;
const getCollectionByIdService = (collectionId, lessInfo = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (lessInfo) {
        const collection = yield getLessInfoCollectionService((0, model_services_1.createObjIdService)(collectionId));
        return collection;
    }
    else {
        const collection = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: (0, model_services_1.createObjIdService)(collectionId) });
        return collection;
    }
});
exports.getCollectionByIdService = getCollectionByIdService;
const getCollectionDetailService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield getExtraInfoCollectionService((0, model_services_1.createObjIdService)(collectionId));
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
        const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, { volumeTrade: { $ne: 0 }, isINO: false }, "_id");
        const topCollection = {};
        yield Promise.all(collections.map((collection) => __awaiter(void 0, void 0, void 0, function* () {
            topCollection[String(collection._id)] = yield getExtraInfoCollectionService(collection._id);
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
const getTopCollectionService = (sortBy = "volumeTrade", sortFrom = "desc", objectQuery = {}, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    objectQuery = (0, other_services_1.removeUndefinedOfObj)(objectQuery);
    const folder = fs_1.default.readdirSync("./public");
    if (!folder.includes("topCollection.json")) {
        fs_1.default.writeFile("./public/topCollection.json", "", "utf8", () => {
            console.log(`Update top collection successfully at ${new Date(Date.now())}`);
        });
    }
    const file = fs_1.default.readFileSync("./public/topCollection.json");
    const topCollection = JSON.parse(file);
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
const getCategoryCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = [];
    let other;
    const LIMITED_ITEMS = Number(process.env.LIMITED_ITEMS) || 4;
    const multiProcess = collection_constant_1.CATEGORY.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
        const collections = yield collection_model_1.default
            .find({ category: obj.key, userAddress: { $ne: default_constant_1.NULL_ADDRESS } }, "_id")
            .sort({ volumeTrade: -1 });
        if (collections.length >= LIMITED_ITEMS) {
            if (obj.key === 0) {
                other = {
                    key: obj.key,
                    data: collections,
                };
            }
            else {
                categories.push({
                    key: obj.key,
                    data: collections,
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
    return collection.collectionAddress === contract_constant_1.MetaSpacecyAssetShared[chainId].toLowerCase();
});
exports.checkIsBaseCollectionService = checkIsBaseCollectionService;
const checkIsOwnerOfCollectionService = (collectionId, userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield getOneCollectionService({ _id: collectionId });
    return collection.userAddress === userAddress;
});
exports.checkIsOwnerOfCollectionService = checkIsOwnerOfCollectionService;
const updateVolumeTradedService = (collectionId, price) => __awaiter(void 0, void 0, void 0, function* () {
    yield collection_model_1.default.findOneAndUpdate({ _id: collectionId }, { $inc: { volumeTrade: price } });
});
exports.updateVolumeTradedService = updateVolumeTradedService;
const getAllCollectionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, {}, "_id collectionAddress collectionName logo isConfirm");
    return collections;
});
exports.getAllCollectionsService = getAllCollectionsService;
const getCollectionsByOwnerItemsService = (userAddress, chainId, collectionName = "", collectionStandard = "", category, pageSize, page, isGetByOwnerItem = true, isGetByCreatorItem = true) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {
        collectionName: collectionName ? { $regex: collectionName, $options: "i" } : undefined,
        collectionStandard: collectionStandard ? { $regex: collectionStandard, $options: "i" } : undefined,
        chainId: chainId && chainId.length > 0 ? chainId : undefined,
        category: category && category.length > 0 ? category : undefined,
    };
    if (isGetByOwnerItem && isGetByCreatorItem) {
        const items = () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield item_model_1.default
                .find((0, other_services_1.removeUndefinedOfObj)({
                $or: [{ owner: userAddress }, { creator: userAddress }],
                chainId: chainId && chainId.length > 0 ? chainId : undefined,
            }), "collectionId")
                .populate("collectionId");
            return {
                items: result,
            };
        });
        const collections = () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, model_services_1.findManyService)(collection_model_1.default, (0, other_services_1.removeUndefinedOfObj)(Object.assign({ userAddress }, queryObj)), "_id");
            return { collections: result };
        });
        const result = yield (0, other_services_1.multiProcessService)([items(), collections()]);
        const collectionsOwnItem = result.items.reduce((collectionArr, current) => {
            const condition1 = collectionName ? current.collectionId.collectionName.match(collectionName) : true;
            const condition2 = collectionStandard
                ? current.collectionId.collectionStandard === collectionStandard
                : true;
            const condition3 = category ? current.collectionId.category === category : true;
            if (condition1 && condition2 && condition3) {
                const collectionId = current.collectionId._id.toString();
                const check = collectionArr.some((element) => element._id === collectionId);
                if (!check) {
                    collectionArr.push({ _id: collectionId });
                }
            }
            return collectionArr;
        }, []);
        result.collections.map((collection) => {
            const check = collectionsOwnItem.some((element) => element._id === collection._id.toString());
            if (!check) {
                collectionsOwnItem.push({ _id: collection._id.toString() });
            }
        });
        return (0, other_services_1.paginateArrayService)(collectionsOwnItem, pageSize, page);
    }
    else if (isGetByOwnerItem && !isGetByCreatorItem) {
        const items = () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield item_model_1.default
                .find((0, other_services_1.removeUndefinedOfObj)({
                owner: userAddress,
                chainId: chainId && chainId.length > 0 ? chainId : undefined,
            }), "collectionId")
                .populate("collectionId");
            return {
                items: result,
            };
        });
        const result = yield (0, other_services_1.multiProcessService)([items()]);
        const collectionsOwnItem = result.items.reduce((collectionArr, current) => {
            const condition1 = collectionName ? current.collectionId.collectionName.match(collectionName) : true;
            const condition2 = collectionStandard
                ? current.collectionId.collectionStandard === collectionStandard
                : true;
            const condition3 = category ? current.collectionId.category === category : true;
            if (condition1 && condition2 && condition3) {
                const collectionId = current.collectionId._id.toString();
                if (!collectionArr.includes({ _id: collectionId })) {
                    collectionArr.push({ _id: collectionId });
                }
            }
            return collectionArr;
        }, []);
        return (0, other_services_1.paginateArrayService)(collectionsOwnItem, pageSize, page);
    }
    else {
        const collections = yield (0, model_services_1.findManyService)(collection_model_1.default, Object.assign({ userAddress }, queryObj), "_id");
        return (0, other_services_1.paginateArrayService)(collections, pageSize, page);
    }
});
exports.getCollectionsByOwnerItemsService = getCollectionsByOwnerItemsService;
const checkCollectionIsConfirmService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield getOneCollectionService({ _id: collectionId });
    return collection.isConfirm;
});
exports.checkCollectionIsConfirmService = checkCollectionIsConfirmService;
const getLessInfoCollectionService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default
        .findById(collectionId)
        .populate({ path: "ownerInfo", select: "userAddress avatar username" })
        .lean();
    const items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collectionId }, "itemMedia itemPreviewMedia");
    const lessCollection = Object.assign(Object.assign({}, collection), { listItem: items.slice(0, 4), items: items.length });
    return lessCollection;
});
exports.getLessInfoCollectionService = getLessInfoCollectionService;
const getExtraInfoCollectionService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default
        .findById(collectionId)
        .populate({ path: "ownerInfo", select: "userAddress avatar username" })
        .lean();
    //add totalItem
    let totalItem = 0;
    const countItemOfCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collectionId }, "owner itemMedia itemPreviewMedia");
        // const numberOfOwner = [...new Map(items.map((item: any) => [item["owner"], item])).values()].length;
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
exports.getExtraInfoCollectionService = getExtraInfoCollectionService;
//BOX
const getBoxCollectionIdService = () => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield collection_model_1.default.find({ category: 7 }, "_id");
    return collections;
});
exports.getBoxCollectionIdService = getBoxCollectionIdService;
const getCollectionBoxService = (pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield (0, model_services_1.queryItemsOfModelInPageService)(collection_model_1.default, { category: 7 }, pageId, pageSize, undefined, "_id");
    return collections;
});
exports.getCollectionBoxService = getCollectionBoxService;
// const getCollectionAssetERC721Service = async (chainId: ChainId): Promise<Collection> => {
// 	let collection: Collection = await getOneCollectionService({
// 		collectionAddress: ASSET_ERC721[chainId].toLowerCase(),
// 		chainId,
// 	});
// 	if (!collection) {
// 		let newCollection = {
// 			collectionAddress: ASSET_ERC721[chainId],
// 			userAddress: process.env.ADMIN || NULL_ADDRESS,
// 			collectionName: "Asset ERC721",
// 			logo: "https://res.cloudinary.com/dkgnummck/image/upload/v1655803792/Asset1155Picture/unique.webp",
// 			background: "https://res.cloudinary.com/dkgnummck/image/upload/v1655803792/Asset1155Picture/unique.webp",
// 			chainId,
// 			collectionStandard: "ERC721",
// 			description: "Welcome to Collection Asset ERC721",
// 		};
// 		collection = await createService(collectionModel, newCollection);
// 	}
// 	return collection;
// };
const getBoarcDropCollectionService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chainId, contract_constant_1.BoarcDrop[chainId]);
    let collection = yield getOneCollectionService({
        collectionAddress: contract_constant_1.BoarcDrop[chainId],
        chainId,
    });
    if (!collection) {
        let newCollection = {
            collectionAddress: contract_constant_1.BoarcDrop[chainId],
            userAddress: process.env.ADMIN || default_constant_1.NULL_ADDRESS,
            collectionName: "Zodiac Sign BOARC",
            logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1652932753/collection/0x6fc46e6f4d8f80cc940af121140ed964350ae411.webp",
            background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1652932753/collection/0x6fc46e6f4d8f80cc940af121140ed964350ae411.webp",
            chainId,
            collectionStandard: "ERC721",
            description: "The miracle zodiac sign created vy Hoang Tuan Long with art of bamboo",
        };
        collection = yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
    }
    return collection;
});
exports.getBoarcDropCollectionService = getBoarcDropCollectionService;
const getCollectionAssetERC1155Service = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chainId, contract_constant_1.MetaSpacecyCreatureAccessory[chainId]);
    let collection = yield getOneCollectionService({
        collectionAddress: contract_constant_1.MetaSpacecyCreatureAccessory[chainId],
        chainId,
    });
    if (!collection) {
        let newCollection = {
            collectionAddress: contract_constant_1.MetaSpacecyCreatureAccessory[chainId],
            userAddress: process.env.ADMIN || default_constant_1.NULL_ADDRESS,
            collectionName: "NFTSpaceX Creature Accessory",
            logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657267794/NCA_Storage/unique.webp",
            background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657267794/NCA_Storage/unique.webp",
            chainId,
            collectionStandard: "ERC1155",
            description: "NCA is a second innovation of NFTSpaceX Asset that belongs to community who are active in the ecosystem.",
        };
        collection = yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
    }
    return collection;
});
exports.getCollectionAssetERC1155Service = getCollectionAssetERC1155Service;
// const getCollectionBoxERC721Service = async (chainId: ChainId): Promise<Collection> => {
// 	let collection: Collection = await getOneCollectionService({
// 		collectionAddress: BOX_ERC721[chainId].toLowerCase(),
// 		chainId,
// 	});
// 	if (!collection) {
// 		let newCollection = {
// 			collectionAddress: BOX_ERC721[chainId],
// 			userAddress: process.env.ADMIN || NULL_ADDRESS,
// 			collectionName: "BOX ERC721",
// 			logo: "https://res.cloudinary.com/dkgnummck/image/upload/v1655193753/admin/QmYTHfBmeUwU8YxG7T7yH8rutDeywV2cYPABcpC2hFmoVq.webp",
// 			background:
// 				"https://res.cloudinary.com/dkgnummck/image/upload/v1655193753/admin/QmYTHfBmeUwU8YxG7T7yH8rutDeywV2cYPABcpC2hFmoVq.webp",
// 			chainId,
// 			collectionStandard: "ERC721",
// 			description: "Welcome to Collection BOX ERC721",
// 			category: 7,
// 		};
// 		collection = await createService(collectionModel, newCollection);
// 	}
// 	return collection;
// };
const getCollectionBoxERC1155Service = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    let collection = yield getOneCollectionService({
        collectionAddress: contract_constant_1.MetaSpacecyMysteriousBox[chainId].toLowerCase(),
        chainId,
    });
    if (!collection) {
        let newCollection = {
            collectionAddress: contract_constant_1.MetaSpacecyMysteriousBox[chainId],
            userAddress: process.env.ADMIN || default_constant_1.NULL_ADDRESS,
            collectionName: "NFTSpaceX Mysterious Box",
            logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268532/NMB_Storage/infinity.webp",
            background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268532/NMB_Storage/infinity.webp",
            chainId,
            collectionStandard: "ERC1155",
            description: "NMB makes the world more mysterious cause no one can predict what is inside it.",
            category: 7,
        };
        collection = yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
    }
    return collection;
});
exports.getCollectionBoxERC1155Service = getCollectionBoxERC1155Service;
//Ticket Card
const getCollectionCardService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    let collection = yield getOneCollectionService({
        collectionAddress: contract_constant_1.MetaSpacecyTicketCard[chainId].toLowerCase(),
        chainId,
    });
    if (!collection) {
        let newCollection = {
            collectionAddress: contract_constant_1.MetaSpacecyTicketCard[chainId],
            userAddress: process.env.ADMIN || default_constant_1.NULL_ADDRESS,
            collectionName: "NFTSpaceX Ticket Card",
            logo: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268841/NTC_Storage/card1.webp",
            background: "https://res.cloudinary.com/dyh2c5n8i/image/upload/v1657268841/NTC_Storage/card1.webp",
            chainId,
            collectionStandard: "ERC1155",
            description: "NTC is a wonderful asset used as a ticket to join INO in the NFTSpaceX initial offering.",
            category: 8,
        };
        collection = yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
    }
    return collection;
});
exports.getCollectionCardService = getCollectionCardService;
/*------------Get Collection Drop-----------------*/
const getCollectionDropp = () => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield collection_model_1.default.find({ isINO: 1 });
    return collection;
});
exports.getCollectionDropp = getCollectionDropp;
/*------------Get Collection By ID-----------------*/
const getUserAddressCollection = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: collectionId });
    return collection.userAddress.toString();
});
exports.getUserAddressCollection = getUserAddressCollection;
/*------------Get Collection Info-----------------*/
const getCollectionIdInfoService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield (0, model_services_1.findOneService)(collectionInfo_model_1.default, { collectionId: collectionId });
    return info;
});
exports.getCollectionIdInfoService = getCollectionIdInfoService;
/*------------Create Collection -----------------*/
const createCollection = (collectionAddress, userAddress, logo, background, collectionName, chainId, collectionStandard, volumeTrade, royalties, description, category, isConfirm, isINO) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = {
        collectionAddress,
        userAddress,
        logo,
        background,
        collectionName,
        chainId,
        collectionStandard,
        volumeTrade,
        royalties,
        description,
        category,
        isConfirm,
        isINO,
    };
    return yield (0, model_services_1.createService)(collection_model_1.default, collection);
});
exports.createCollection = createCollection;
/*------------Create Collection Info-----------------*/
const createCollectionInfo = (collectionId, image, tittle, totalNFT, chainId, price, symbolPrice, owner, totalSales, status, startTime, endTime, benefits = Array, creator, ERC, item, content, active) => __awaiter(void 0, void 0, void 0, function* () {
    const collecInfo = {
        collectionId,
        image,
        tittle,
        totalNFT,
        availableNFT: totalNFT,
        chainId,
        price,
        symbolPrice,
        owner,
        totalSales,
        status,
        startTime,
        endTime,
        benefits,
        creator,
        ERC,
        item,
        content,
        active
    };
    yield (0, model_services_1.createService)(collectionInfo_model_1.default, collecInfo);
});
exports.createCollectionInfo = createCollectionInfo;
/*------------Upadte Collection Info-----------------*/
const updateCollectionInfo = (collectionId, obj) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield (0, model_services_1.updateOneService)(collectionInfo_model_1.default, collectionId, obj);
    return update;
});
exports.updateCollectionInfo = updateCollectionInfo;
/*------------Upadte Amount Item in Collection in Collection Info-----------------*/
const updateTotalItemService = (queryUpdate, updateTotal) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield (0, model_services_1.updateOneService)(collectionInfo_model_1.default, queryUpdate, updateTotal);
    return update;
});
exports.updateTotalItemService = updateTotalItemService;
// const updateTotalItemService = async(collectionId: String, productId: String, totalItem: String) => {
// 	const query = {
// 		"collectionId": collectionId,
// 		"item.$.productId": productId
// 	}
// 	const set = {
// 		"item.$.totalItem": totalItem
// 	}
// 	const update: CollectionInfo = await collectionInfo.findOneAndUpdate(query,{$set: set})
// 	console.log(update)
// 	return update;
// }
const updateTotalItem = (collectionId, availableItem, productId, userAddress, itemTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryUpdate = {
        collectionId
    };
    const total = yield getCollectionIdInfoService(collectionId);
    const item = total.item;
    let totalNFT = 0;
    let owner = Number(total.owner);
    for (let i = 0; i < item.length; i++) {
        if (item[i].productId === productId) {
            totalNFT = Number(item[i].availableItem) - availableItem;
            item[i].availableItem = availableItem;
            if ((yield (0, item_services_1.updateOwnerItem1155)(itemTokenId, collectionId, userAddress)) === true) {
                owner++;
            }
            break;
        }
    }
    let availableNFT = 0;
    for (let i = 0; i < item.length; i++) {
        availableNFT = availableNFT + Number(item[i].availableItem);
    }
    const sold = totalNFT;
    const totalSales = Number(total.totalSales) + (Number(total.price) * 10 * sold * 10) / 100;
    const update = {
        item,
        owner
    };
    const Info = {
        availableNFT,
        totalSales
    };
    const id = {
        collectionId
    };
    const a = yield updateCollectionInfo(id, Info);
    const b = yield updateTotalItemService(queryUpdate, update);
    const result = yield getCollectionIdInfoService(collectionId);
    return result;
});
exports.updateTotalItem = updateTotalItem;
