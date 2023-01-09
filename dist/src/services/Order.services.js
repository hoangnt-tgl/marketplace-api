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
exports.getOrderDetailService = exports.returnOrderService = exports.getOneOrderService = exports.getListTokenService = exports.deleteOrderByItemIdService = exports.getOrderByObjectQueryService = exports.createOrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_model_1 = __importDefault(require("../models/Order.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("./model.services");
const model_services_2 = require("./model.services");
const price_services_1 = require("./price.services");
const price_services_2 = require("../services/price.services");
const units_1 = require("@ethersproject/units");
const createOrderService = (chainId, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, type) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = {
        _id: new mongoose_1.default.Types.ObjectId(),
        chainId,
        maker,
        taker,
        makerRelayerFee,
        takerRelayerFee,
        feeRecipient,
        side,
        saleKind,
        target,
        itemId,
        howToCall,
        callData,
        replacementPattern,
        staticTarget,
        staticExtraData,
        paymentToken,
        basePrice,
        extra,
        listingTime,
        expirationTime,
        salt,
        feeMethod,
        makerProtocolFee,
        takerProtocolFee,
        r,
        s,
        v,
        type,
    };
    const order = yield (0, model_services_1.createService)(Order_model_1.default, newOrder);
    return returnOrderService(order);
});
exports.createOrderService = createOrderService;
const getOrderByObjectQueryService = (objectQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = objectQuery.asc == "1" ? 1 : -1;
    const orders = yield (0, model_services_2.findManyService)(Order_model_1.default, Object.assign(Object.assign({}, objectQuery), { isDelete: false }), "_id", { basePrice: sort });
    return orders;
});
exports.getOrderByObjectQueryService = getOrderByObjectQueryService;
const getOrderDetailService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield (0, model_services_2.findOneService)(Order_model_1.default, { _id: (0, model_services_1.createObjIdService)(orderId) });
    yield returnAdditionalInfoOfOrderService(order);
    return order;
});
exports.getOrderDetailService = getOrderDetailService;
const deleteOrderByItemIdService = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, model_services_1.updateOneService)(Order_model_1.default, { _id, isDeleted: false }, { isDeleted: true });
    yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: order.itemId }, { status: 0 });
    return returnOrderService(order);
});
exports.deleteOrderByItemIdService = deleteOrderByItemIdService;
const getListTokenService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield (0, price_services_1.getManyTokenService)({ chainId });
    const listTokens = [];
    tokens.map((token) => {
        listTokens.push({
            chainId: token.chainId,
            name: token.tokenName,
            address: token.tokenAddress,
            symbol: token.tokenSymbol.toUpperCase(),
            logoURI: token.logoURI
        });
    });
    return listTokens;
});
exports.getListTokenService = getListTokenService;
const getOneOrderService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, model_services_2.findOneService)(Order_model_1.default, Object.assign(Object.assign({}, objQuery), { type: 0, isDeleted: false }));
    yield returnAdditionalInfoOfOrderService(order);
    return order;
});
exports.getOneOrderService = getOneOrderService;
const returnAdditionalInfoOfOrderService = (order) => __awaiter(void 0, void 0, void 0, function* () {
    if (order) {
        const token = yield (0, price_services_1.getTokenService)({
            chainId: Number(process.env.DEFAULT_CHAINID),
            tokenAddress: order.paymentToken.toLowerCase(),
        });
        let usdPrice;
        yield Promise.all([(usdPrice = yield (0, price_services_2.changePriceService)(token.tokenSymbol, "usd", order === null || order === void 0 ? void 0 : order.basePrice))]);
        order["salePrice"] = (0, units_1.formatUnits)(order === null || order === void 0 ? void 0 : order.basePrice, token.decimal);
        order["usdPrice"] = usdPrice;
    }
});
const returnOrderService = (order) => {
    let returnValue = null;
    if (order) {
        returnValue = {
            orderId: order._id,
            chainId: order.chainId,
            maker: order.maker,
            taker: order.taker,
            makerRelayerFee: order.makerRelayerFee,
            takerRelayerFee: order.takerRelayerFee,
            feeRecipient: order.feeRecipient,
            side: order.side,
            saleKind: order.saleKind,
            target: order.target,
            itemId: order.itemId,
            howToCall: order.howToCall,
            callData: order.callData,
            replacementPattern: order.replacementPattern,
            staticTarget: order.staticTarget,
            staticExtraData: order.staticExtraData,
            paymentToken: order.paymentToken,
            basePrice: order.basePrice,
            extra: order.extra,
            listingTime: order.listingTime,
            expirationTime: order.expirationTime,
            salt: order.salt,
            feeMethod: order.feeMethod,
            isDeleted: order.isDeleted,
            makerProtocolFee: order.makerProtocolFee,
            takerProtocolFee: order.takerProtocolFee,
            r: order.r,
            s: order.s,
            v: order.v,
            type: order.type,
        };
    }
    return returnValue;
};
exports.returnOrderService = returnOrderService;
