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
exports.getManyOrderService = exports.getListingPriceItemService = exports.getOrderDetailService = exports.getOneOrderService = exports.getListTokenService = exports.deleteOrderByItemIdService = exports.createOrderService = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const Order_model_1 = __importDefault(require("../models/Order.model"));
const price_services_1 = require("../services/price.services");
const model_services_1 = require("./model.services");
const price_services_2 = require("./price.services");
const createOrderService = (chainId, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, type, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = {
        chainId,
        maker,
        taker,
        makerRelayerFee,
        takerRelayerFee,
        feeRecipient,
        side,
        saleKind,
        target,
        itemId: (0, model_services_1.createObjIdService)(itemId),
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
        quantity,
    };
    const order = yield (0, model_services_1.createService)(Order_model_1.default, newOrder);
    return order;
});
exports.createOrderService = createOrderService;
const getOrderDetailService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: (0, model_services_1.createObjIdService)(orderId) });
    const extraOrder = yield returnAdditionalInfoOfOrderService(order);
    return extraOrder;
});
exports.getOrderDetailService = getOrderDetailService;
const deleteOrderByItemIdService = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, model_services_1.updateOneService)(Order_model_1.default, { _id, isDeleted: false }, { isDeleted: true });
    yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: order.itemId }, { status: 0 });
    return order;
});
exports.deleteOrderByItemIdService = deleteOrderByItemIdService;
const getListTokenService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield (0, price_services_2.getManyTokenService)({ chainId });
    const listTokens = [];
    tokens.map((token) => {
        listTokens.push({
            chainId: token.chainId,
            name: token.tokenName,
            address: token.tokenAddress,
            symbol: token.tokenSymbol.toUpperCase(),
            logoURI: token.logoURI,
        });
    });
    return listTokens;
});
exports.getListTokenService = getListTokenService;
const getOneOrderService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, model_services_1.findOneService)(Order_model_1.default, {
        maker: objQuery.userAddress,
        itemId: (0, model_services_1.createObjIdService)(objQuery.itemId),
        type: Number(objQuery.type),
        isDeleted: false,
    });
    let extraOrder;
    if (order) {
        extraOrder = yield returnAdditionalInfoOfOrderService(order);
    }
    return extraOrder;
});
exports.getOneOrderService = getOneOrderService;
const getManyOrderService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield (0, model_services_1.findManyService)(Order_model_1.default, Object.assign(Object.assign({}, objQuery), { type: 0, isDeleted: false }), "_id");
    return orders;
});
exports.getManyOrderService = getManyOrderService;
const getListingPriceItemService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield (0, model_services_1.findManyService)(Order_model_1.default, {
        itemId: (0, model_services_1.createObjIdService)(itemId),
        type: 0,
        isDelete: false,
    });
    let listingPrice = 0;
    if (orders.length > 0) {
        for (let i = 0; i < orders.length; i++) {
            const token = yield (0, price_services_2.getTokenService)({ tokenAddress: orders[i].paymentToken });
            const orderPrice = yield (0, price_services_1.changePriceService)(token.tokenName, "usd", orders[i].basePrice);
            listingPrice += orderPrice / orders[i].quantity;
        }
        listingPrice /= orders.length;
    }
    return listingPrice;
});
exports.getListingPriceItemService = getListingPriceItemService;
const returnAdditionalInfoOfOrderService = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, price_services_2.getTokenService)({
        chainId: order.chainId,
        tokenAddress: order.paymentToken.toLowerCase(),
    });
    let usdPrice;
    yield Promise.all([(usdPrice = yield (0, price_services_1.changePriceService)(token.tokenSymbol, "usd", order === null || order === void 0 ? void 0 : order.basePrice))]);
    const extraOrder = Object.assign(Object.assign({}, order), { salePrice: (0, price_services_1.fromWeiToTokenService)(order === null || order === void 0 ? void 0 : order.basePrice, token.decimal), tokenSymbol: token.tokenSymbol, usdPrice: usdPrice });
    return extraOrder;
});
