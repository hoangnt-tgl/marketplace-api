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
exports.sellItem = exports.buyItem = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("../services/model.services");
const response_constants_1 = require("../constant/response.constants");
const sellItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { price, quantity, itemId, to, txHash, collectionId, owner, collectionName, itemName } = req.body;
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { collectionName, userAddress: owner, chainId });
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { itemName, collectionId: collectionInfo._id });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let newOrder = {
            maker: userAddress,
            chainId: chainId,
            quantity: quantity,
            itemId: itemInfo._id,
            basePrice: price,
            type: 6,
        };
        let orderInfo = yield (0, model_services_1.createService)(Order_model_1.default, newOrder);
        let newHistory = {
            collectionId: collectionInfo._id,
            itemId: itemInfo._id,
            from: userAddress,
            to: to,
            quantity: quantity,
            type: 6,
            txHash: txHash,
            price: price,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        return res.status(200).json({ data: orderInfo });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.sellItem = sellItem;
const buyItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { quantity, itemId, to, txHash, collectionId, owner, collectionName, itemName, price } = req.body;
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { collectionName, userAddress: owner, chainId });
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { itemName, collectionId: collectionInfo._id });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        (0, model_services_1.deleteOneService)(Order_model_1.default, { itemId: itemInfo._id });
        let newHistory = {
            collectionId: collectionInfo._id,
            itemId: itemInfo._id,
            from: userAddress,
            to: to,
            quantity: quantity,
            type: 7,
            txHash: txHash,
            price: price,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        return res.status(200).json({ data: newHistory });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.buyItem = buyItem;
