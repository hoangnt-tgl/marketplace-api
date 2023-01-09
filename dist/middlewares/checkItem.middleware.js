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
exports.checkItemInCollection = exports.checkHistoryExistMiddleware = exports.checkItemSelling = exports.checkOwnerItemMiddleware = exports.checkItemCanCreateMiddleware = exports.checkItemExistMiddleware = exports.checkItemCanUpdateMiddleware = void 0;
const model_services_1 = require("../services/model.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const collection_services_1 = require("../services/collection.services");
const item_services_1 = require("../services/item.services");
const response_constants_1 = require("../constant/response.constants");
const item_services_2 = require("../services/item.services");
const checkItemExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId || req.body.itemId || req.body.boxId;
        if (!itemId) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const exist = yield (0, item_services_1.checkItemExistsService)({ _id: (0, model_services_1.createObjIdService)(itemId) });
        if (!exist) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkItemExistMiddleware = checkItemExistMiddleware;
const checkItemCanUpdateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.body.itemId || req.params.itemId;
        const userAddress = req.body.userAddress || req.params.userAddress;
        const isFreeze = yield (0, item_services_1.checkItemIsFreezeService)(itemId);
        const isBaseItem = yield (0, item_services_1.checkIsBaseItemService)(itemId);
        const isCreator = yield (0, item_services_1.checkCreatorItemService)(itemId, userAddress);
        if (isFreeze) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        if (!isBaseItem) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        if (!isCreator) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkItemCanUpdateMiddleware = checkItemCanUpdateMiddleware;
const checkItemCanCreateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = req.params.collectionId || req.body.collectionId;
    const chainId = req.params.chainId || req.body.chainId;
    const quantity = req.body.quantity;
    try {
        const isBaseCollection = yield (0, collection_services_1.checkIsBaseCollectionService)(chainId, collectionId);
        if (!isBaseCollection) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        if (quantity) {
            if (quantity > 1099511627775 || quantity <= 0) {
                return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
            }
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkItemCanCreateMiddleware = checkItemCanCreateMiddleware;
const checkOwnerItemMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.params.owner || req.body.owner;
    const itemId = req.params.itemId || req.body.itemId;
    const type = req.body.type;
    try {
        if (type !== 0 && type !== 1) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        if (type === 0) {
            const isOwnerItem = yield (0, item_services_1.checkOwnerItemService)(owner, itemId);
            if (!isOwnerItem)
                return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkOwnerItemMiddleware = checkOwnerItemMiddleware;
const checkItemSelling = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId || req.body.itemId;
        const type = req.params.type || req.body.type;
        const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
        if (item.status === 1 && type === 0)
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        else
            return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkItemSelling = checkItemSelling;
const checkHistoryExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const historyId = req.params.historyId || req.body.historyId;
        const history = yield (0, model_services_1.findOneService)(history_model_1.default, { _id: historyId });
        if (!history)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        else
            return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkHistoryExistMiddleware = checkHistoryExistMiddleware;
/*------------@Dev:Huy-----------------*/
const checkItemInCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId || req.body.itemId || req.query.itemId;
        const collectionId = req.params.collectionId || req.body.collectionId || req.query.collectionId;
        if (!(0, item_services_2.getSearchItemByIdService)(itemId)) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        else {
            let item = yield (0, item_services_2.getItemsByCollectionService)(collectionId);
            for (let i = 0; i < item.length; i++) {
                if (item[i]._id.toString() === itemId) {
                    return next();
                }
            }
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkItemInCollection = checkItemInCollection;
