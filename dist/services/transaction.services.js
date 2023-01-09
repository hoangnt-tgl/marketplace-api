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
exports.acceptOfferTransactionService = exports.offerTransactionService = exports.buyTransactionService = exports.sellTransactionService = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const collection_model_1 = __importDefault(require("../models/collection.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const Order_model_1 = __importDefault(require("../models/Order.model"));
const collection_services_1 = require("./collection.services");
const history_services_1 = require("./history.services");
const item_services_1 = require("./item.services");
const model_services_1 = require("./model.services");
const Order_services_1 = require("./Order.services");
const price_services_1 = require("./price.services");
const sellTransactionService = (chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, type, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const orderSell = yield (0, Order_services_1.createOrderService)(chainId, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, type, quantity);
    const token = yield (0, price_services_1.getTokenService)({ chainId: chainId, tokenAddress: paymentToken });
    const symbolToken = token.tokenSymbol;
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    const collection = yield (0, model_services_1.findOneService)(collection_model_1.default, { _id: collectionId });
    if (orderSell) {
        yield Promise.all([
            (0, item_services_1.updateStatusItemService)((0, model_services_1.createObjIdService)(itemId), { status: 1 }),
            (0, item_services_1.updatePriceItemService)(itemId, { priceType: symbolToken }),
            (0, item_services_1.updatePriceItemService)(itemId, { price: basePrice }),
            (0, history_services_1.createHistoryService)(collection._id, item._id, maker, contract_constant_1.MetaSpacecyExchange[chainId], basePrice, symbolToken, quantity, "", 6),
        ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
            yield func;
        })));
    }
    return orderSell;
});
exports.sellTransactionService = sellTransactionService;
const offerTransactionService = (chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, type, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    let newOrderOffer = yield (0, Order_services_1.createOrderService)(chainId, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, type, quantity);
    yield (0, item_services_1.updateStatusItemService)((0, model_services_1.createObjIdService)(itemId), { offer_status: 1 });
    return newOrderOffer;
});
exports.offerTransactionService = offerTransactionService;
const buyTransactionService = (chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, finalPrice, extra, listingTime, expirationTime, salt, r, s, v, transactionHash, makerProtocolFee, takerProtocolFee, quantity, orderAcceptedId) => __awaiter(void 0, void 0, void 0, function* () {
    let orderSell = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: (0, model_services_1.createObjIdService)(orderAcceptedId) });
    const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
    const symbolToken = token.tokenSymbol;
    if (symbolToken && transactionHash && orderSell)
        yield (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderSell._id });
    try {
        const orderBuy = yield (0, Order_services_1.createOrderService)(chainId, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, 2, quantity);
        if (orderBuy) {
            const order = yield (0, item_services_1.checkItemStatusService)((0, model_services_1.createObjIdService)(itemId), 0);
            yield Promise.all([
                !order && (0, item_services_1.updateStatusItemService)((0, model_services_1.createObjIdService)(itemId), { status: 0 }),
                (0, item_services_1.updateOwnerItemService)(itemId, maker, taker),
                (0, item_services_1.updatePriceItemService)(itemId, {
                    price: finalPrice,
                    priceType: symbolToken,
                }),
            ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                yield func;
            })));
            const finalPriceToUSD = yield (0, price_services_1.changePriceService)(symbolToken, "usd", finalPrice);
            const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
            yield Promise.all([
                (0, history_services_1.createHistoryService)((0, model_services_1.createObjIdService)(item.collectionId), (0, model_services_1.createObjIdService)(item._id), maker, taker, finalPrice, symbolToken, 0, transactionHash, 3),
                (0, collection_services_1.updateVolumeTradedService)((0, model_services_1.createObjIdService)(item.collectionId), Number(finalPriceToUSD)),
                (0, history_services_1.createHistoryService)((0, model_services_1.createObjIdService)(item.collectionId), (0, model_services_1.createObjIdService)(item._id), taker, maker, "0", "eth", quantity, transactionHash, 4),
                (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderBuy._id, itemId, type: 2 }),
            ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                yield func;
            })));
        }
        const order = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: orderBuy._id });
        return order;
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.buyTransactionService = buyTransactionService;
const acceptOfferTransactionService = (chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, finalPrice, extra, listingTime, expirationTime, salt, r, s, v, transactionHash, makerProtocolFee, takerProtocolFee, quantity, orderAcceptedId) => __awaiter(void 0, void 0, void 0, function* () {
    let orderOffer = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: (0, model_services_1.createObjIdService)(orderAcceptedId) });
    if (orderOffer)
        yield (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderOffer._id });
    const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
    const symbolToken = token.tokenSymbol;
    const orderOfferAccept = yield (0, Order_services_1.createOrderService)(chainId, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, 3, quantity);
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    if (orderOfferAccept) {
        const order = yield (0, item_services_1.checkItemStatusService)((0, model_services_1.createObjIdService)(itemId), 1);
        yield Promise.all([
            !order && (0, item_services_1.updateStatusItemService)((0, model_services_1.createObjIdService)(itemId), { offer_status: 0 }),
            (0, item_services_1.updateOwnerItemService)(itemId, taker, maker),
            (0, item_services_1.updatePriceItemService)(itemId, {
                price: finalPrice,
                priceType: symbolToken,
            }),
        ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
            yield func;
        })));
        const finalPriceToUSD = yield (0, price_services_1.changePriceService)(symbolToken, "usd", finalPrice);
        yield Promise.all([
            yield (0, history_services_1.createHistoryService)((0, model_services_1.createObjIdService)(item.collectionId), (0, model_services_1.createObjIdService)(item._id), taker, maker, finalPrice, symbolToken, 0, transactionHash, 2),
            (0, collection_services_1.updateVolumeTradedService)((0, model_services_1.createObjIdService)(item.collectionId), Number(finalPriceToUSD)),
            (0, history_services_1.createHistoryService)((0, model_services_1.createObjIdService)(item.collectionId), (0, model_services_1.createObjIdService)(item._id), maker, taker, "0", "eth", quantity, transactionHash, 4),
            (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderOfferAccept._id }),
        ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
            yield func;
        })));
    }
    // return await findOneService(orderModel, { maker, taker, itemId, transactionHash, type: { $eq: 3 } });
    return yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: orderOfferAccept._id, type: { $eq: 3 } });
});
exports.acceptOfferTransactionService = acceptOfferTransactionService;
