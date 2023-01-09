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
exports.getManyTokenService = exports.fromWeiToTokenService = exports.changePriceService = exports.getPriceService = exports.getTokenService = void 0;
const model_services_1 = require("./model.services");
const units_1 = require("@ethersproject/units");
const token_model_1 = __importDefault(require("../models/token.model"));
const changePrice_model_1 = __importDefault(require("../models/changePrice.model"));
const getTokenService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    if ((objQuery === null || objQuery === void 0 ? void 0 : objQuery.tokenSymbol) === "nft") {
        return { decimal: 1 };
    }
    const token = yield (0, model_services_1.findOneService)(token_model_1.default, objQuery, properties);
    return token;
});
exports.getTokenService = getTokenService;
const getManyTokenService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, model_services_1.findManyService)(token_model_1.default, objQuery);
    return token;
});
exports.getManyTokenService = getManyTokenService;
const getPriceService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const price = yield (0, model_services_1.findOneService)(changePrice_model_1.default, objQuery);
    return price;
});
exports.getPriceService = getPriceService;
const changePriceService = (from, to, weiPrice) => __awaiter(void 0, void 0, void 0, function* () {
    from = from.toLowerCase();
    to = to.toLowerCase();
    const chainId = Number(process.env.DEFAULT_CHAINID);
    const pair = `${from}-${to}`;
    const token = yield getTokenService({ chainId, tokenSymbol: from });
    const tokenPrice = fromWeiToTokenService(weiPrice, token.decimal);
    let priceFeed = yield getPriceService({ pair });
    if (!priceFeed) {
        priceFeed = yield getPriceService({ pair: "eth-usd" });
    }
    const usdPrice = priceFeed.result * tokenPrice;
    return usdPrice;
});
exports.changePriceService = changePriceService;
const fromWeiToTokenService = (weiPrice, tokenDecimal) => {
    if (tokenDecimal === 1) {
        return Number(weiPrice);
    }
    return weiPrice === "0" ? 0 : Number((0, units_1.formatUnits)(weiPrice, tokenDecimal));
};
exports.fromWeiToTokenService = fromWeiToTokenService;
