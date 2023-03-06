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
exports.getTopCollection = exports.getAllCollection = exports.getCollectionByCategory = exports.getCollectionByUserAddress = exports.getCollectionById = exports.createCollection = exports.getVolumeTradeCollectionController = exports.getAllCollectionByCategory = exports.getNewCollectionController = void 0;
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("../services/model.services");
const item_services_1 = require("../services/item.services");
const response_constants_1 = require("../constant/response.constants");
const collection_services_1 = require("../services/collection.services");
const collection_constant_1 = require("../constant/collection.constant");
const history_services_1 = require("../services/history.services");
const createCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let newCollection = req.body;
        newCollection.userAddress = userAddress;
        newCollection.chainId = chainId;
        const existCollection = yield (0, model_services_1.queryExistService)(collection_model_1.default, {
            userAddress,
            chainId,
            collectionName: newCollection.collectionName,
        });
        if (existCollection)
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        let collectionInfo = yield (0, model_services_1.createService)(collection_model_1.default, newCollection);
        let newHistory = {
            collectionId: collectionInfo._id,
            from: userAddress,
            to: req.body.to,
            type: 1,
            txHash: req.body.txHash,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        return res.status(200).json({ data: collectionInfo });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot Create Collection" });
    }
});
exports.createCollection = createCollection;
const getCollectionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { collectionId } = req.params;
        let ownerFull = [];
        let ownerFill = [];
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: collectionId });
        collectionInfo.countOwner = 0;
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let items = yield (0, item_services_1.getAllItemService)({ collectionId: collectionInfo._id });
        yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            ownerFull.push(String(item.owner));
        })));
        ownerFill = Array.from(new Set(ownerFull));
        collectionInfo.volumeTrade = Number(yield (0, history_services_1.getHistoryTradeByCollectionIdService)(collectionId));
        collectionInfo.countOwner = Number(ownerFill.length);
        collectionInfo.listItem = items;
        collectionInfo.minTradeItem = yield (0, history_services_1.getMinTradeItemService)(String(collectionInfo._id));
        return res.status(200).json({ data: collectionInfo });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get Collection" });
    }
});
exports.getCollectionById = getCollectionById;
const getCollectionByUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let collectionInfo = yield (0, collection_services_1.getListCollectionService)({ userAddress, chainId });
        yield Promise.all(collectionInfo.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
            let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
            collectionInfo[index].listItem = items;
        })));
        return res.status(200).json({ data: collectionInfo });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get Collection" });
    }
});
exports.getCollectionByUserAddress = getCollectionByUserAddress;
const getCollectionByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { category, chainId } = req.params;
        let collections = yield (0, collection_services_1.getListCollectionService)({ category, chainId });
        yield Promise.all(collections.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
            let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
            collections[index].listItem = items;
        })));
        return res.status(200).json({ data: collections });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get Collection" });
    }
});
exports.getCollectionByCategory = getCollectionByCategory;
const getAllCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chainId } = req.params;
        let collections = yield (0, collection_services_1.getListCollectionService)({ chainId });
        yield Promise.all(collections.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
            let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
            collections[index].listItem = items;
        })));
        return res.status(200).json({ data: collections });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get all Collection" });
    }
});
exports.getAllCollection = getAllCollection;
const getTopCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortBy = req.body.sortBy;
        const sortFrom = req.body.sortFrom;
        const { pageSize, pageId, chainId } = req.params;
        const { userAddress, collectionName, collectionStandard, category } = req.body;
        const objectQuery = {
            userAddress,
            collectionName,
            collectionStandard,
            category,
        };
        const collections = yield (0, collection_services_1.getTopCollectionService)(sortBy, sortFrom, objectQuery, Number(pageSize), Number(pageId), chainId);
        return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get top collection" });
    }
});
exports.getTopCollection = getTopCollection;
const getNewCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield (0, collection_services_1.getNewCollectionService)();
        return res.status(200).json(collection);
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get new Collection" });
    }
});
exports.getNewCollectionController = getNewCollectionController;
const getAllCollectionByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let chainId = Number(req.params.chainId);
        // let categoryCollection: {category: String, collection: Collection[]}[] = [];
        let categoryCollection = {};
        categoryCollection["All"] = [];
        for (let i = 1; i < 9; i++) {
            let category = Number(collection_constant_1.CATEGORY[i].key);
            let collections = yield (0, collection_services_1.getListCollectionService)({ category, chainId });
            yield Promise.all(collections.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
                let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
                collections[index].listItem = items;
            })));
            if (collections.length > 0) {
                categoryCollection["All"] = categoryCollection["All"].concat(collections);
                categoryCollection[collection_constant_1.CATEGORY[i].type] = collections;
            }
        }
        return res.status(200).json({ data: categoryCollection });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get all Collection" });
    }
});
exports.getAllCollectionByCategory = getAllCollectionByCategory;
const getVolumeTradeCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield (0, collection_services_1.getVolumeCollectionService)(id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getVolumeTradeCollectionController = getVolumeTradeCollectionController;
