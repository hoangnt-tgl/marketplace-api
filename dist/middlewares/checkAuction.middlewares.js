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
exports.checkAuctionSettleMiddleware = exports.updateAuctionStatusMiddleware = exports.checkPaymentTokenMiddleware = exports.checkAuctionExistMiddleware = exports.checkListItemAuctionMiddleware = exports.checkCreateAuctionMiddleware = void 0;
const price_services_1 = require("../services/price.services");
const auction_services_1 = require("../services/auction.services");
const response_constants_1 = require("../constant/response.constants");
const checkCreateAuctionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentToken, minPrice, endTime, bidIncreasePercent, transactionHash, startTime } = req.body;
        if (!paymentToken ||
            !minPrice ||
            endTime === undefined ||
            !transactionHash ||
            !startTime ||
            bidIncreasePercent === undefined) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkCreateAuctionMiddleware = checkCreateAuctionMiddleware;
const checkPaymentTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainId = req.body.chainId;
        const paymentToken = req.body.paymentToken;
        if (!paymentToken) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
        const symbolToken = token.tokenSymbol;
        if (!symbolToken) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkPaymentTokenMiddleware = checkPaymentTokenMiddleware;
const checkListItemAuctionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body.listItemId;
        if (!items || items.length === 0) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkListItemAuctionMiddleware = checkListItemAuctionMiddleware;
const checkAuctionExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auctionId = req.params.auctionId || req.body.auctionId;
        if (!auctionId) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        const check = yield (0, auction_services_1.checkAuctionExistService)(auctionId);
        if (!check) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkAuctionExistMiddleware = checkAuctionExistMiddleware;
const updateAuctionStatusMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auction_services_1.updateAuctionStatusService)();
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.updateAuctionStatusMiddleware = updateAuctionStatusMiddleware;
const checkAuctionSettleMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auctionId = req.params.auctionId;
        const auction = yield (0, auction_services_1.getOneAuctionService)({ _id: auctionId });
        if (auction.isLive) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return next();
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkAuctionSettleMiddleware = checkAuctionSettleMiddleware;
