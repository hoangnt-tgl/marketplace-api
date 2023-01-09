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
exports.getOfferDetailService = exports.queryOfferService = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const model_services_1 = require("../services/model.services");
const price_services_1 = require("./price.services");
const default_constant_1 = require("../constant/default.constant");
const other_services_1 = require("./other.services");
const queryOfferService = (chainId, maker, taker, itemId, asc) => __awaiter(void 0, void 0, void 0, function* () {
    const objQuery = (0, other_services_1.removeUndefinedOfObj)({
        chainId: chainId && chainId.length ? chainId : undefined,
        maker,
        taker,
        itemId,
    });
    const offers = yield Order_model_1.default
        .find((0, other_services_1.removeUndefinedOfObj)(Object.assign(Object.assign({}, objQuery), { type: 1, isDeleted: false })))
        .lean()
        .populate({ path: "itemInfo", select: "itemName itemMedia" });
    console.log(offers);
    const orderOffers = [];
    yield Promise.all(offers.map((offer) => __awaiter(void 0, void 0, void 0, function* () {
        orderOffers.push(yield returnExtraInfoOfferService(chainId, offer));
    })));
    return asc === 1
        ? orderOffers.sort((a, b) => a.createdAt - b.createdAt)
        : orderOffers.sort((a, b) => b.createdAt - a.createdAt);
});
exports.queryOfferService = queryOfferService;
const returnExtraInfoOfferService = (chainId, offer, isQueryByUser = true) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, price_services_1.getTokenService)({
        chainId: chainId,
        tokenAddress: offer.paymentToken.toLowerCase(),
    });
    console.log(token);
    let usdPrice;
    yield Promise.all([(usdPrice = yield (0, price_services_1.changePriceService)(token.tokenSymbol, "usd", offer === null || offer === void 0 ? void 0 : offer.basePrice))]);
    const extraOffer = Object.assign(Object.assign({}, offer), { priceLogo: token.logoURI, offerPrice: (0, price_services_1.fromWeiToTokenService)(offer.basePrice, token.decimal), usdPrice: usdPrice, tokenSymbol: token.tokenSymbol });
    return extraOffer;
});
const getOfferDetailService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    let offer = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: (0, model_services_1.createObjIdService)(orderId), type: 1, isDeleted: false });
    yield returnExtraInfoOfferService(default_constant_1.DEFAULT_CHAIN_ID, offer);
    return offer;
});
exports.getOfferDetailService = getOfferDetailService;
