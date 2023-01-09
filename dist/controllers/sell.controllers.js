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
const response_constants_1 = require("../constant/response.constants");
const transaction_services_1 = require("../services/transaction.services");
// POST Methods
const createSellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, feeMethod, maker, taker, quantity, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, type, } = req.body;
    try {
        if (type === 0) {
            const orderSell = yield (0, transaction_services_1.sellTransactionService)(chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, type, quantity);
            if (orderSell)
                res.status(200).send({ message: "Create Order's sell was successful", orderSell });
            else
                res.status(403).send({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        else if (type === 1) {
            let newOrderOffer = yield (0, transaction_services_1.offerTransactionService)(chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, type, quantity);
            if (newOrderOffer)
                res.status(200).send({ message: "Offer successful", newOrderOffer });
            else
                res.status(403).send({ message: response_constants_1.ERROR_RESPONSE[403] });
        }
        else {
            res.status(500).send({ message: response_constants_1.ERROR_RESPONSE[500] });
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.createSellController = createSellController;
