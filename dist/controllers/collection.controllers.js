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
exports.getTopCollection = exports.getAllCollection = exports.getCollectionByCategory = exports.getCollectionByUserAddress = exports.getCollectionById = exports.createCollection = void 0;
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("../services/model.services");
const response_constants_1 = require("../constant/response.constants");
const collection_services_1 = require("../services/collection.services");
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
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createCollection = createCollection;
const getCollectionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { collectionId } = req.params;
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: collectionId });
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collectionInfo._id });
        collectionInfo.listItem = items;
        return res.status(200).json({ data: collectionInfo });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionById = getCollectionById;
const getCollectionByUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let collectionInfo = yield (0, model_services_1.findManyService)(collection_model_1.default, { userAddress, chainId });
        yield Promise.all(collectionInfo.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
            let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
            collectionInfo[index].listItem = items;
        })));
        return res.status(200).json({ data: collectionInfo });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionByUserAddress = getCollectionByUserAddress;
const getCollectionByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { category, chainId } = req.params;
        let collections = yield (0, model_services_1.findManyService)(collection_model_1.default, { category, chainId });
        yield Promise.all(collections.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
            let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
            collections[index].listItem = items;
        })));
        return res.status(200).json({ data: collections });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getCollectionByCategory = getCollectionByCategory;
const getAllCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chainId } = req.params;
        let collections = yield (0, model_services_1.findManyService)(collection_model_1.default, { chainId });
        yield Promise.all(collections.map((collection, index) => __awaiter(void 0, void 0, void 0, function* () {
            let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: collection._id });
            collections[index].listItem = items;
        })));
        return res.status(200).json({ data: collections });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
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
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getTopCollection = getTopCollection;
