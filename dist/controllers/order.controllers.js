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
exports.getOrderSellItem = exports.cancelOrder = exports.sellItem = exports.buyItem = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("../services/model.services");
const response_constants_1 = require("../constant/response.constants");
const aptos_services_1 = require("../services/aptos.services");
const sellItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { price, quantity, itemId, to, txHash, collectionId, collectionName, itemName, creator } = req.body;
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { collectionName, userAddress: creator, chainId });
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { itemName, collectionId: collectionInfo._id });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let balanceOwner = yield (0, aptos_services_1.getBalanceTokenForAccount)(userAddress, creator, collectionName, itemName, chainId);
        console.log(balanceOwner);
        let owners = itemInfo.owner;
        if (balanceOwner.toString() === "0") {
            owners = owners.filter((item) => item !== userAddress);
        }
        yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { price: price, status: 1, owner: owners });
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
        return res.status(500).json({ error: "Cannot Sell Item" });
    }
});
exports.sellItem = sellItem;
const buyItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { quantity, itemId, to, txHash, collectionId, owner, collectionName, itemName, price, creator } = req.body;
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { collectionName, userAddress: creator, chainId });
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { itemName, collectionId: collectionInfo._id });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        (0, model_services_1.updateOneService)(collection_model_1.default, { _id: collectionInfo._id }, { volumeTrade: collectionInfo.volumeTrade + price });
        let owners = itemInfo.owner;
        if (!owners.includes(userAddress)) {
            owners.push(userAddress);
        }
        owners.push(userAddress);
        yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { owner: owners, status: 0 });
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
        return res.status(500).json({ error: "Cannot buy Item" });
    }
});
exports.buyItem = buyItem;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { itemId, collectionId, owner, collectionName, itemName, creator, to, txHash, quantity } = req.body;
        let collectionInfo = yield (0, model_services_1.findOneService)(collection_model_1.default, { collectionName, userAddress: creator, chainId });
        if (!collectionInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { itemName, collectionId: collectionInfo._id });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let owners = itemInfo.owner;
        if (!owners.includes(userAddress)) {
            owners.push(userAddress);
        }
        yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { price: 0, status: 0, owner: owners });
        (0, model_services_1.deleteOneService)(Order_model_1.default, { itemId: itemInfo._id });
        let newHistory = {
            collectionId: collectionInfo._id,
            itemId: itemInfo._id,
            from: userAddress,
            to: to,
            quantity: quantity,
            type: 5,
            txHash: txHash,
            price: 0,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        return res.status(200).json({ message: "Cancel order success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.cancelOrder = cancelOrder;
const getOrderSellItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { itemId } = req.body;
        let orders = yield (0, model_services_1.findOneService)(Order_model_1.default, { isDeleted: false, itemId, chainId, type: 6 });
        return res.status(200).json({ data: orders });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getOrderSellItem = getOrderSellItem;
