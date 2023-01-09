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
exports.checkItemMetaDataMiddleware = exports.checkItemSelling = exports.checkOwnerItemMiddleware = exports.checkItemCanCreateMiddleware = exports.checkItemExistMiddleware = exports.checkItemCanUpdateMiddleware = void 0;
const model_services_1 = require("../services/model.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const collection_services_1 = require("../services/collection.services");
const item_services_1 = require("../services/item.services");
const checkItemExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId || req.body.itemId;
        if (itemId) {
            const exist = yield (0, item_services_1.checkItemExistsService)({ _id: (0, model_services_1.createObjIdService)(itemId) });
            if (exist) {
                return next();
            }
            else {
                return res.status(404).json({ error: "Item not found" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(404).json({ error: "Missing item object id" });
});
exports.checkItemExistMiddleware = checkItemExistMiddleware;
const checkItemCanUpdateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, userAddress } = req.params;
    const isFreeze = yield (0, item_services_1.checkItemIsFreezeService)(itemId);
    const isBaseItem = yield (0, item_services_1.checkIsBaseItemService)(itemId);
    const isCreator = yield (0, item_services_1.checkCreatorItemService)(itemId, userAddress);
    if (isFreeze) {
        return res.status(403).json({ error: "Item is Freeze" });
    }
    if (!isBaseItem) {
        return res.status(403).json({ error: "Can't access to item" });
    }
    if (!isCreator) {
        return res.status(403).json({ error: "User is not creator of item" });
    }
    return next();
});
exports.checkItemCanUpdateMiddleware = checkItemCanUpdateMiddleware;
const checkItemCanCreateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.params.collectionId || req.body.collectionId;
    const chainId = req.params.chainId || req.body.chainId;
    const isBaseCollection = yield (0, collection_services_1.checkIsBaseCollectionService)(chainId, collectionId);
    if (isBaseCollection) {
        return next();
    }
    return res.status(400).json({ error: "Collection is not valid" });
});
exports.checkItemCanCreateMiddleware = checkItemCanCreateMiddleware;
const checkItemMetaDataMiddleware = (req, res, next) => {
    const metaData = req.body.metaData;
    if (!metaData) {
        return res.status(403).json({ error: "Missing metaData" });
    }
    return next();
};
exports.checkItemMetaDataMiddleware = checkItemMetaDataMiddleware;
const checkOwnerItemMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.params.owner || req.body.owner;
    const itemId = req.params.itemId || req.body.itemId;
    const type = req.body.type;
    if (type === 0) {
        const isOwnerItem = yield (0, item_services_1.checkOwnerItemService)(owner, itemId);
        if (isOwnerItem)
            return next();
        else
            return res.status(403).json({ error: "You're not owner this item" });
    }
    else if (type === 1)
        return next();
    else
        return res.status(403).json({ error: "Missing type order" });
});
exports.checkOwnerItemMiddleware = checkOwnerItemMiddleware;
const checkItemSelling = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.itemId || req.body.itemId;
    const type = req.params.type || req.body.type;
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    if (item.status === 1 && type === 0)
        res.status(403).json({ error: "Item has been already selling" });
    else
        return next();
});
exports.checkItemSelling = checkItemSelling;
