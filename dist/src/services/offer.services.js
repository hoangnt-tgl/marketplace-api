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
exports.getOneOfferService = exports.getOfferDetailService = exports.queryOfferService = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("../services/model.services");
const price_services_1 = require("./price.services");
const units_1 = require("@ethersproject/units");
const queryOfferService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = objQuery.asc == "1" ? 1 : -1;
    let offers = yield (0, model_services_1.findManyService)(Order_model_1.default, Object.assign(Object.assign({}, objQuery), { type: 1, isDeleted: false }), "_id", {
        basePrice: sort,
    });
    return offers;
});
exports.queryOfferService = queryOfferService;
const returnExtraInfoOfferService = (offer, isQueryByUser = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (offer) {
        const token = yield (0, price_services_1.getTokenService)({
            chainId: Number(process.env.DEFAULT_CHAINID),
            tokenAddress: offer.paymentToken.toLowerCase(),
        });
        let usdPrice;
        yield Promise.all([(usdPrice = yield (0, price_services_1.changePriceService)(token.tokenSymbol, "usd", offer === null || offer === void 0 ? void 0 : offer.basePrice))]);
        offer["priceLogo"] = token.logoURI;
        offer["offerPrice"] = (0, units_1.formatUnits)(offer === null || offer === void 0 ? void 0 : offer.basePrice, token.decimal);
        offer["usdPrice"] = usdPrice;
        offer['symbolToken'] = token.tokenSymbol;
        if (isQueryByUser === true) {
            const item = yield (0, model_services_1.findOneService)(item_model_1.default, { itemId: offer.itemId });
            offer["itemName"] = item.itemName;
            offer["itemMedia"] = item.itemMedia;
        }
    }
});
const getOfferDetailService = (orderId, isQueryByUser = false) => __awaiter(void 0, void 0, void 0, function* () {
    let offer = yield (0, model_services_1.findOneService)(Order_model_1.default, { _id: (0, model_services_1.createObjIdService)(orderId), type: 1, });
    yield returnExtraInfoOfferService(offer, isQueryByUser);
    return offer;
});
exports.getOfferDetailService = getOfferDetailService;
const getOneOfferService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const offer = yield (0, model_services_1.findOneService)(Order_model_1.default, Object.assign(Object.assign({}, objQuery), { type: 1, isDeleted: false }));
    yield returnExtraInfoOfferService(offer);
    return offer;
});
exports.getOneOfferService = getOneOfferService;
