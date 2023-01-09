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
const price_services_2 = require("../services/price.services");
const auction_services_1 = require("../services/auction.services");
const item_services_1 = require("../services/item.services");
const checkCreateAuctionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, minPrice, paymentToken, expirationTime, bidIncreasePercent, seller, transactionHash } = req.body;
    const token = yield (0, price_services_2.getTokenService)({ chainId, tokenAddress: paymentToken });
    const exampleBody = {
        items: ["itemObjId 1", "itemObjId 2"],
        minPrice: "Number",
        expirationTime: "Date",
        bidIncreasePercent: "Number",
        paymentToken: "Symbol of token",
        seller: "Address of seller",
        nftRecipient: "address of recipient (default Null_Address)",
        transactionHash: "hash of transaction create auction",
    };
    if (!minPrice || expirationTime === undefined || !seller || !transactionHash) {
        return res.status(400).json({ error: `Please provide params like example`, example: exampleBody });
    }
    const tokenPrice = (0, price_services_1.fromWeiToTokenService)(minPrice, token.decimal);
    if (tokenPrice === 0) {
        return res.status(400).json({ error: "minPrice must greater than 0" });
    }
    if (expirationTime <= Math.round(Date.now() / 1000)) {
        return res.status(400).json({ error: "expirationTime must greater than current time" });
    }
    if (bidIncreasePercent <= 0) {
        return res.status(400).json({ error: "bidIncreasePercent must greater than 0" });
    }
    return next();
});
exports.checkCreateAuctionMiddleware = checkCreateAuctionMiddleware;
const checkPaymentTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.body.chainId;
    const paymentToken = req.body.paymentToken;
    if (!paymentToken) {
        return res.status(404).json({ error: "Missing payment token" });
    }
    const token = yield (0, price_services_2.getTokenService)({ chainId, tokenAddress: paymentToken });
    const symbolToken = token.tokenSymbol;
    if (!symbolToken) {
        return res.status(404).json({ error: `${paymentToken} is not support` });
    }
    return next();
});
exports.checkPaymentTokenMiddleware = checkPaymentTokenMiddleware;
const checkListItemAuctionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const items = req.body.items;
    const collectionId = req.body.collectionId;
    const seller = req.body.seller;
    if (!items || items.length === 0) {
        return res.status(404).json({ error: "Please provide items" });
    }
    for (let i = 0; i < items.length; i++) {
        let item = yield (0, item_services_1.getOneItemService)({ _id: items[i] });
        let checkIsAuction = yield (0, auction_services_1.checkItemIsAuctionService)(items[i]);
        if (!item) {
            return res.status(404).json({ error: `itemId ${items[i]} is not exist` });
        }
        if (item.collectionId.toString() !== collectionId) {
            return res.status(400).json({ error: `itemId ${items[i]} is in another collection` });
        }
        if (item.owner.toLowerCase() !== seller.toLowerCase()) {
            return res.status(400).json({ error: `User ${seller} hasn't own itemId ${items[i]}` });
        }
        if (item.status !== 0) {
            return res.status(400).json({ error: `Item status is not valid` });
        }
        if (checkIsAuction) {
            return res.status(400).json({ error: `itemId ${items[i]} is on auction` });
        }
    }
    return next();
});
exports.checkListItemAuctionMiddleware = checkListItemAuctionMiddleware;
const checkAuctionExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auctionId = req.params.auctionId || req.body.auctionId;
    if (!auctionId) {
        return res.status(404).json({ error: "Missing auctionId" });
    }
    const check = yield (0, auction_services_1.checkAuctionExistService)(auctionId);
    if (!check) {
        return res.status(404).json({ error: "Auction not found" });
    }
    return next();
});
exports.checkAuctionExistMiddleware = checkAuctionExistMiddleware;
const updateAuctionStatusMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auction_services_1.updateAuctionStatusService)();
    return next();
});
exports.updateAuctionStatusMiddleware = updateAuctionStatusMiddleware;
const checkAuctionSettleMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auctionId = req.params.auctionId;
    const auction = yield (0, auction_services_1.getOneAuctionService)({ _id: auctionId });
    if (auction.isLive) {
        return res.status(400).json({ error: "Auction still live" });
    }
    return next();
});
exports.checkAuctionSettleMiddleware = checkAuctionSettleMiddleware;
