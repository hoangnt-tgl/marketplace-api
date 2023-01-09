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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSellController = void 0;
const Order_services_1 = require("../services/Order.services");
const item_services_1 = require("../services/item.services");
const history_services_1 = require("../services/history.services");
const price_services_1 = require("../services/price.services");
// POST Methods
const createSellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, type, } = req.body;
    try {
        let orderSell;
        if (type === 0) {
            orderSell = yield (0, Order_services_1.createOrderService)(parseInt(chainId), maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, type);
            const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
            const symbolToken = token.tokenSymbol;
            if (orderSell) {
                yield Promise.all([
                    (0, item_services_1.updateStatusItemService)(itemId, { status: 1 }),
                    (0, item_services_1.updatePriceItemService)(itemId, {
                        listingPrice: basePrice,
                        listingPriceType: symbolToken,
                    }),
                    (0, history_services_1.createHistoryService)(collectionId, itemId, maker, "", basePrice, symbolToken, "", 6),
                ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                    yield func;
                })));
            }
            else
                res.status(400).send({ error: "Failed to create order sell" });
            return res.status(201).send({ message: "Create Order's sell was successful", orderSell });
        }
        else {
            let newOrderOffer;
            yield Promise.all([
                (newOrderOffer = yield (0, Order_services_1.createOrderService)(parseInt(chainId), maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, 1)),
                yield (0, item_services_1.updateStatusItemService)(itemId, { offer_status: 1 }),
            ]);
            if (newOrderOffer)
                return res.status(201).send({ message: "Offer successful", newOrderOffer });
            else
                return res.status(400).send({ message: "Failed to offer" });
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.createSellController = createSellController;
