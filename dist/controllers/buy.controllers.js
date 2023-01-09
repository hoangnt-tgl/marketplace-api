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
exports.createBuyController = void 0;
const response_constants_1 = require("../constant/response.constants");
const transaction_services_1 = require("../services/transaction.services");
const createBuyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, makerProtocolFee, takerProtocolFee, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, finalPrice, extra, listingTime, expirationTime, salt, r, s, v, transactionHash, type, quantity, orderAcceptedId, } = req.body;
    try {
        if (type === 2) {
            const orderBuy = yield (0, transaction_services_1.buyTransactionService)(chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, finalPrice, extra, listingTime, expirationTime, salt, r, s, v, transactionHash, makerProtocolFee, takerProtocolFee, quantity, orderAcceptedId);
            if (!orderBuy)
                res.status(200).send({ message: "Create Order's buy was successfully" });
            else
                res.status(403).send({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        else if (type === 3) {
            const orderOffer = yield (0, transaction_services_1.acceptOfferTransactionService)(chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, collectionId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, finalPrice, extra, listingTime, expirationTime, salt, r, s, v, transactionHash, makerProtocolFee, takerProtocolFee, quantity, orderAcceptedId);
            if (!orderOffer)
                res.status(200).send({ message: "Offer successfully accepted" });
            else
                res.status(403).send({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        else {
            res.status(403).send({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.createBuyController = createBuyController;
