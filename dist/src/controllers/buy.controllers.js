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
exports.createBuyController = void 0;
const Order_services_1 = require("../services/Order.services");
const item_services_1 = require("../services/item.services");
const model_services_1 = require("../services/model.services");
const collection_services_1 = require("../services/collection.services");
const model_services_2 = require("../services/model.services");
const Order_model_1 = __importDefault(require("../models/Order.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const Order_model_2 = __importDefault(require("../models/Order.model"));
const price_services_1 = require("../services/price.services");
const history_services_1 = require("../services/history.services");
const createBuyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, makerProtocolFee, takerProtocolFee, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, finalPrice, extra, listingTime, expirationTime, salt, r, s, v, transactionHash, type, } = req.body;
    try {
        let orderSell;
        orderSell = yield (0, model_services_2.findOneService)(Order_model_2.default, { itemId });
        const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
        const symbolToken = token.tokenSymbol;
        if (!symbolToken)
            return res.status(400).json({ message: "Failed to get symbol token" });
        if (type === 2) {
            if (transactionHash && orderSell)
                yield (0, model_services_1.deleteOneService)(Order_model_1.default, { itemId, type: 0 });
            const orderBuy = yield (0, Order_services_1.createOrderService)(parseInt(chainId), maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, 2);
            if (orderBuy) {
                yield Promise.all([
                    yield (0, item_services_1.updateStatusItemService)(itemId, { status: 0 }),
                    yield (0, item_services_1.updateOwnerItemService)(itemId, maker),
                    yield (0, item_services_1.updatePriceItemService)(itemId, {
                        price: finalPrice,
                        priceType: symbolToken,
                        listingPrice: "0",
                        listingPriceType: "usd",
                    }),
                ]);
                const finalPriceToUSD = yield (0, price_services_1.changePriceService)(symbolToken, "usd", finalPrice);
                const item = yield (0, model_services_2.findOneService)(item_model_1.default, { _id: itemId });
                yield (0, collection_services_1.updateVolumeTradedService)(item.collectionId, Number(finalPriceToUSD));
                yield (0, history_services_1.createHistoryService)(collectionId, itemId, maker, taker, finalPrice, symbolToken, transactionHash, 3);
                const transferHistory = yield (0, history_services_1.createHistoryService)(collectionId, itemId, taker, maker, "1", "nft", transactionHash, 4);
                if (transferHistory) {
                    yield (0, model_services_1.deleteOneService)(Order_model_1.default, { itemId, type: 2 });
                    yield (0, model_services_1.deleteManyService)(Order_model_1.default, { itemId, type: 1 });
                }
            }
            else
                return res.status(400).send({ error: "Failed to create order buy" });
            return res.status(201).send({ message: "Create Order's buy was successfully" });
        }
        else {
            if (orderSell)
                yield (0, model_services_1.deleteOneService)(Order_model_1.default, { itemId, type: 0 });
            const orderOfferAccept = yield (0, Order_services_1.createOrderService)(parseInt(chainId), maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, 3);
            if (orderOfferAccept) {
                yield Promise.all([
                    (0, item_services_1.updateStatusItemService)(itemId, { offer_status: 0 }),
                    (0, item_services_1.updateOwnerItemService)(itemId, maker),
                    (0, item_services_1.updatePriceItemService)(itemId, {
                        price: finalPrice,
                        priceType: symbolToken,
                        listingPrice: "0",
                        listingPriceType: "usd",
                    }),
                ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                    yield func;
                })));
                const finalPriceToUSD = yield (0, price_services_1.changePriceService)(symbolToken, "usd", finalPrice);
                const item = yield (0, model_services_2.findOneService)(item_model_1.default, { _id: itemId });
                yield Promise.all([
                    (0, collection_services_1.updateVolumeTradedService)(item.collectionId, Number(finalPriceToUSD)),
                    (0, history_services_1.createHistoryService)(collectionId, itemId, maker, taker, finalPrice, symbolToken, transactionHash, 3),
                ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                    yield func;
                })));
                const transferHistory = yield (0, history_services_1.createHistoryService)(collectionId, itemId, taker, maker, "1", "nft", transactionHash, 4);
                const acceptedOfferHistory = yield (0, history_services_1.createHistoryService)(collectionId, itemId, maker, "", finalPrice, symbolToken, transactionHash, 2);
                if (transferHistory && acceptedOfferHistory) {
                    yield Promise.all([(0, model_services_1.deleteOneService)(Order_model_1.default, { itemId, type: 3 }), (0, model_services_1.deleteManyService)(Order_model_1.default, { itemId, type: 1 })].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                        yield func;
                    })));
                }
            }
            else
                return res.status(400).send({ error: "Failed to accept offer" });
            return res.status(201).send({ message: "Offer successfully accepted" });
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.createBuyController = createBuyController;
