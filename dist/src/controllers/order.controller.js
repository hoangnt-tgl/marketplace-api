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
exports.getOrderByItemController = exports.getOrderDetailController = exports.getListToken = exports.getOrderQueryController = exports.deleteOrderByItemIdController = exports.getOrderByItemIdAndOwnerController = exports.createOrderController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("../services/model.services");
const Order_services_1 = require("../services/Order.services");
const price_services_1 = require("../services/price.services");
const history_services_1 = require("../services/history.services");
const Order_model_1 = __importDefault(require("../models/Order.model"));
const token_model_1 = __importDefault(require("../models/token.model"));
/**
 * @author [dev-huy]
 * @create date 2022-02-17 17:17:35
 * @modify date 2022-02-17 17:17:35
 * @desc [Get List Token By ChainId]
 */
const getListToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainId = req.query.chainId;
        const listToken = yield (0, Order_services_1.getListTokenService)(chainId);
        res.status(200).json({ data: listToken });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getListToken = getListToken;
/**
 * @author [dev-huy]
 * @create date 2022-02-16 11:47:51
 * @modify date 2022-02-16 11:47:51
 * @desc [Create Order]
 */
const createOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId } = req.params;
        const { maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, howToCall, callData, replacementPattern, staticTarget, staticExtraData, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, itemId, paymentToken, type } = req.body;
        const newOrder = yield (0, Order_services_1.createOrderService)(parseInt(chainId), maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, type);
        if (newOrder) {
            return res.status(200).json({ message: "Create order successfully", data: newOrder });
        }
        return res.status(400).json({ message: "Failed to create new order" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createOrderController = createOrderController;
/**
 * @author [dev-huy]
 * @create date 2022-02-16 11:52:19
 * @modify date 2022-02-16 11:52:19
 * @desc [Get Order By ItemId, Maker, Side]
 */
const getOrderByItemIdAndOwnerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, maker, side } = req.params;
        const findOrder = yield (0, Order_services_1.getOneOrderService)({ itemId, maker, side });
        if (findOrder !== null) {
            return res.status(200).json({ data: findOrder });
        }
        return res.status(400).json({ message: "Order not found" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getOrderByItemIdAndOwnerController = getOrderByItemIdAndOwnerController;
/**
 * @author [dev-huy]
 * @create date 2022-02-17 14:23:20
 * @modify date 2022-02-17 14:23:20
 * @desc [Get Query Order List]
 */
const getOrderQueryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.body.chainId;
    const itemId = req.body.itemId;
    const taker = req.body.taker;
    const maker = req.body.maker;
    const side = req.body.side;
    const listingTime = req.body.listingTime;
    const expirationTime = req.body.expirationTime;
    const paymentToken = req.body.paymentToken;
    const saleKInd = req.body.saleKind;
    const target = req.body.target;
    const asc = req.body.asc;
    const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
    try {
        const listOrder = yield (0, Order_services_1.getOrderByObjectQueryService)({ chainId, itemId, taker, maker, side, listingTime, expirationTime, token, saleKInd, target, asc });
        if (listOrder) {
            return res.status(200).json({ data: listOrder });
        }
        return res.status(400).json({ message: "List Order not found" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getOrderQueryController = getOrderQueryController;
/**
 * @author [dev-huy]
 * @create date 2022-02-17 17:17:35
 * @modify date 2022-02-17 17:17:35
 * @desc [Update isDelete Order]
 */
const deleteOrderByItemIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, orderId, type, transactionHash } = req.body;
        let deleteOrder;
        const order = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: orderId });
        const token = yield (0, model_services_1.findOneService)(token_model_1.default, { tokenAddress: order.paymentToken });
        console.log(token);
        if (type == '0') {
            Promise.all([
                yield (0, history_services_1.createHistoryService)(collectionId, order.itemId, order.maker, order.taker, order.basePrice, token.tokenSymbol, transactionHash, 5),
                yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: order.itemId }, { listingPrice: '0', listingPriceType: 'usd' })
            ]);
        }
        deleteOrder = yield (0, Order_services_1.deleteOrderByItemIdService)(new mongoose_1.default.Types.ObjectId(orderId));
        if (deleteOrder) {
            return res.status(200).json(deleteOrder);
        }
        return res.status(500).json({ message: 'Failed to delete order' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteOrderByItemIdController = deleteOrderByItemIdController;
const getOrderDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const order = yield (0, Order_services_1.getOrderDetailService)(orderId);
        if (!order)
            return res.status(400).json({ message: 'Order not found' });
        res.status(200).json({ data: order });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ errors: error.message });
    }
});
exports.getOrderDetailController = getOrderDetailController;
const getOrderByItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const order = yield (0, Order_services_1.getOneOrderService)({ itemId });
        if (order !== null) {
            return res.status(200).json({ data: order });
        }
        return res.status(400).json({ message: "Order not found" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getOrderByItemController = getOrderByItemController;
