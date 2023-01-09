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
exports.queryOneOfferController = exports.queryOfferController = exports.getOfferDetailController = exports.getOfferByUserController = exports.updateOfferController = exports.getOfferByItemController = void 0;
const model_services_1 = require("../services/model.services");
const offer_services_1 = require("../services/offer.services");
const Order_model_1 = __importDefault(require("../models/Order.model"));
const Order_services_1 = require("../services/Order.services");
const getOfferDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const offer = yield (0, offer_services_1.getOfferDetailService)(orderId);
        if (!offer)
            return res.status(400).json({ message: "Offer not found" });
        res.status(200).json(offer);
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ errors: error.message });
    }
});
exports.getOfferDetailController = getOfferDetailController;
const getOfferByItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const offer = yield (0, offer_services_1.getOfferDetailService)(orderId);
        if (offer)
            res.status(200).json(offer);
        else
            res.status(400).json({ message: "Failed to get offers" });
    }
    catch (error) {
        res.status(400).json({ errors: error.message });
    }
});
exports.getOfferByItemController = getOfferByItemController;
const getOfferByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const offer = yield (0, offer_services_1.getOfferDetailService)(orderId, true);
        if (offer)
            res.status(200).json(offer);
        else
            res.status(400).json({ message: "Failed to get offers" });
    }
    catch (error) {
        res.status(400).json({ errors: error.message });
    }
});
exports.getOfferByUserController = getOfferByUserController;
const queryOfferController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.body.chainId || undefined;
    const maker = req.body.maker || undefined;
    const taker = req.body.taker || undefined;
    const itemId = req.body.itemId || undefined;
    const asc = req.body.asc;
    try {
        const offers = yield (0, offer_services_1.queryOfferService)({ chainId, maker, taker, itemId, asc });
        if (offers)
            res.status(200).json({ data: offers });
        else
            res.status(400).json({ message: "Failed to get offers" });
    }
    catch (error) {
        res.status(400).json({ errors: error.message });
    }
});
exports.queryOfferController = queryOfferController;
const queryOneOfferController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, itemId } = req.params;
    try {
        const offer = yield (0, offer_services_1.getOneOfferService)({ maker: userAddress, itemId });
        if (offer)
            res.status(200).json(offer);
        else
            res.status(400).json({ message: "Failed to get offer" });
    }
    catch (error) {
        res.status(400).json({ errors: error.message });
    }
});
exports.queryOneOfferController = queryOneOfferController;
const updateOfferController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { chainId, feeMethod, maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, r, s, v, makerProtocolFee, takerProtocolFee, } = req.body;
    try {
        // const signature = await createSignatureService(r, s, v, messageHash, rawTransaction, transactionHash);
        // if (!signature)
        //     return res.status(400).send({
        //         errors: "Can't offer",
        //     });
        let newOrderOffer;
        Promise.all([
            yield (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderId }),
            (newOrderOffer = yield (0, Order_services_1.createOrderService)(parseInt(chainId), maker, taker, makerRelayerFee, takerRelayerFee, feeRecipient, side, saleKind, target, itemId, howToCall, callData, replacementPattern, staticTarget, staticExtraData, paymentToken, basePrice, extra, listingTime, expirationTime, salt, feeMethod, makerProtocolFee, takerProtocolFee, r, s, v, 1)),
        ]);
        if (newOrderOffer)
            return res.status(200).send({ message: "Offer successful", newOrderOffer });
        else
            return res.status(400).send({ message: "Failed to offer" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateOfferController = updateOfferController;
