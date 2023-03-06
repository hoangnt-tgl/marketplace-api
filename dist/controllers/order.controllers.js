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
exports.getOrderSellItem = exports.cancelOrder = exports.sellItem = exports.buyItem = exports.getOrderByCreationNumber = exports.getOrderByInstantSaleFalseController = exports.getOrderByInstantSaleTrueController = exports.getOrderByItemIdController = exports.deleteOrderController = exports.getOrderByIdController = exports.createOrderController = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("../services/model.services");
const order_services_1 = require("../services/order.services");
const response_constants_1 = require("../constant/response.constants");
const aptos_services_1 = require("../services/aptos.services");
const item_services_1 = require("../services/item.services");
const sellItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        userAddress = userAddress.toLowerCase();
        let { price, quantity, itemId, to, txHash, coinType, startTime, instantSale, auctionId, endTime } = req.body;
        // startTime = new Date(startTime).getTime()
        // endTime = new Date(endTime).getTime()
        //find id item
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { price: price, status: 1 });
        let newOrder = {};
        if (instantSale === false) {
            newOrder = {
                chainId: 2,
                maker: userAddress,
                itemId: (0, model_services_1.createObjIdService)(itemId),
                minPrice: price,
                coinType: coinType,
                creationNumber: yield (0, order_services_1.getCreationNumService)(txHash),
                amount: quantity,
                startTime: startTime,
                expirationTime: endTime,
                instantSale,
                type: 6,
                auctionId: yield (0, order_services_1.getAuctionIdService)(txHash),
            };
            // let newAuction = {
            // 	chainId: 2,
            // 	itemId: itemId,
            // 	collectionId: createObjIdService(itemInfo.collectionId),
            // 	paymentToken: coinType,
            // 	minPrice: price,
            // 	seller: userAddress,
            // 	startTime: new Date(Number(startTime)),
            // 	endTime: new Date(Number(endTime)),
            // 	isLive: true,
            // };
            // await createService(auctionModel, newAuction);
        }
        else {
            newOrder = {
                chainId: 2,
                maker: userAddress,
                itemId: (0, model_services_1.createObjIdService)(itemId),
                minPrice: price,
                coinType: coinType,
                creationNumber: yield (0, order_services_1.getCreationNumService)(txHash),
                amount: quantity,
                startTime: startTime,
                expirationTime: endTime,
                instantSale,
                type: 6,
            };
        }
        let orderInfo = yield (0, model_services_1.createService)(Order_model_1.default, newOrder);
        let newHistory = {
            collectionId: itemInfo.collectionId,
            itemId: itemInfo._id,
            from: userAddress,
            to: to,
            quantity: quantity,
            type: 6,
            txHash: txHash,
            price: price,
            priceType: coinType,
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
        let { quantity, itemId, to, txHash, orderId } = req.body;
        let orderInfo = yield (0, order_services_1.getOrderByIdService)(orderId);
        let itemInfo = yield (0, item_services_1.getOneItemService)({ _id: itemId });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        yield (0, model_services_1.updateOneService)(collection_model_1.default, { _id: itemInfo.collectionId }, { volumeTrade: itemInfo.collectionInfo.volumeTrade + orderInfo.minPrice });
        let owners = itemInfo.owner;
        let balance = yield (0, aptos_services_1.getBalanceTokenForAccount)(orderInfo.maker, itemInfo.creator, itemInfo.collectionInfo.collectionName, itemInfo.itemName);
        if (balance === "0") {
            owners = owners.filter((owner) => owner !== orderInfo.maker);
        }
        if (!owners.includes(userAddress)) {
            owners.push(userAddress);
        }
        yield (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderId });
        let isExist = yield (0, model_services_1.queryExistService)(Order_model_1.default, { itemId: itemId, instantSale: true });
        if (!isExist) {
            yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { owner: owners, status: 0 });
        }
        else {
            yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { owner: owners });
        }
        let newHistory = {};
        newHistory = {
            collectionId: itemInfo.collectionId,
            itemId: itemInfo._id,
            from: userAddress,
            to: to,
            quantity: quantity,
            type: 7,
            txHash: txHash,
            price: orderInfo.minPrice,
            priceType: orderInfo.coinType,
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
        let { orderId, txHash } = req.body;
        let orderInfo = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: orderId });
        let itemInfo = yield (0, item_services_1.getOneItemService)({ _id: orderInfo.itemId });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        let newHistory = {
            collectionId: itemInfo.collectionId,
            itemId: itemInfo._id,
            from: userAddress,
            quantity: Number(orderInfo.amount),
            type: 5,
            txHash: txHash,
            price: 0,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        yield (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderId });
        let findOrderItemId = yield (0, model_services_1.queryExistService)(Order_model_1.default, { itemId: itemInfo._id });
        if (!findOrderItemId) {
            yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemInfo._id }, { status: 0 });
        }
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
const createOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId, maker, itemId, minPrice, coinType, amount, startTime, expirationTime, instantSale, auctionId } = req.body;
        const txHash = String(req.body.txHash);
        const creation_number = yield (0, order_services_1.getCreationNumService)(txHash);
        const order = yield (0, order_services_1.createOrderService)(chainId, maker, itemId, minPrice, coinType, creation_number, amount, startTime, expirationTime, instantSale, auctionId);
        res.status(200).json({ data: order });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createOrderController = createOrderController;
const getOrderByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield (0, order_services_1.getOrderByIdService)(orderId);
        res.status(200).json({ data: order });
    }
    catch (error) {
        return res.status(500).json({ messsage: "Get order fail" });
    }
});
exports.getOrderByIdController = getOrderByIdController;
const deleteOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        yield (0, order_services_1.deleteOrderService)(orderId);
        res.status(200).json({ message: "Delete order success" });
    }
    catch (error) {
        return res.status(500).json({ message: "Delete order fail" });
    }
});
exports.deleteOrderController = deleteOrderController;
const getOrderByItemIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const orders = yield (0, order_services_1.getOrderByItemIdService)(itemId);
        res.status(200).json({ data: orders });
    }
    catch (error) {
        return res.status(500).json({ message: "Get order by item id fail" });
    }
});
exports.getOrderByItemIdController = getOrderByItemIdController;
const getOrderByInstantSaleTrueController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_services_1.getOrderByInstantSaleTrueService)();
        res.status(200).json({ data: orders });
    }
    catch (error) {
        return res.status(500).json({ message: "Get order by instant sale true fail" });
    }
});
exports.getOrderByInstantSaleTrueController = getOrderByInstantSaleTrueController;
const getOrderByInstantSaleFalseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_services_1.getOrderByInstantSaleFalseService)();
        res.status(200).json({ data: orders });
    }
    catch (error) {
        return res.status(500).json({ message: "Get order by instant sale false fail" });
    }
});
exports.getOrderByInstantSaleFalseController = getOrderByInstantSaleFalseController;
const getOrderByCreationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.params;
        userAddress = userAddress.toLowerCase();
        const { creationNumber } = req.body;
        let orderInfo = yield (0, order_services_1.getOneOrderService)({ maker: userAddress, creationNumber: creationNumber });
        res.status(200).json(orderInfo);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getOrderByCreationNumber = getOrderByCreationNumber;
