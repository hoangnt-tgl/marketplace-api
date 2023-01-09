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
exports.getAuctionByItemIdService = exports.getAuctionByIdService = exports.getManyAuctionService = exports.updateAuctionStatusService = exports.checkItemIsAuctionService = exports.getTopBidService = exports.queryAuctionService = exports.settleAuctionService = exports.getOneAuctionService = exports.checkAuctionExistService = exports.makeBidService = exports.createAuctionService = void 0;
const makeBid_model_1 = __importDefault(require("../models/makeBid.model"));
const auction_model_1 = __importDefault(require("../models/auction.model"));
const makeBid_services_1 = require("./makeBid.services");
const model_services_1 = require("./model.services");
const price_services_1 = require("./price.services");
const other_services_1 = require("./other.services");
const createAuctionService = (chainId, collectionId, items, minPrice, expirationTime, bidIncreasePercent, paymentToken, seller, recipient) => __awaiter(void 0, void 0, void 0, function* () {
    const arrObjItemId = [];
    yield Promise.all(items.map((item) => {
        arrObjItemId.push((0, model_services_1.createObjIdService)(item));
    }));
    const obj = {
        chainId,
        collectionId: (0, model_services_1.createObjIdService)(collectionId),
        items: arrObjItemId,
        minPrice,
        expirationTime,
        bidIncreasePercent,
        paymentToken,
        seller,
        recipient,
    };
    const auction = yield (0, model_services_1.createService)(auction_model_1.default, obj);
    const returnAuction = returnAuctionService(auction);
    yield returnAdditionalAuctionService(returnAuction);
    return returnAuction;
});
exports.createAuctionService = createAuctionService;
const queryAuctionService = (chainId, isLive, collectionId, itemId, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    let isLiveValue;
    if (isLive !== undefined) {
        isLiveValue = isLive === "true";
    }
    else {
        isLiveValue = isLive;
    }
    const auctions = yield (0, model_services_1.queryItemsOfModelInPageService)(auction_model_1.default, { chainId, isLive: isLiveValue, collectionId, itemId }, pageId, pageSize, undefined, "_id");
    return auctions;
});
exports.queryAuctionService = queryAuctionService;
const makeBidService = (auctionId, bidAmount, userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const auction = yield (0, model_services_1.updateOneService)(auction_model_1.default, { _id: auctionId }, { highestBid: bidAmount, highestBidder: userAddress });
    const returnAuction = returnAuctionService(auction);
    yield returnAdditionalAuctionService(returnAuction);
    return returnAuction;
});
exports.makeBidService = makeBidService;
const checkAuctionExistService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(auction_model_1.default, { _id: auctionId });
});
exports.checkAuctionExistService = checkAuctionExistService;
const getOneAuctionService = (queryObj, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const auction = yield (0, model_services_1.findOneService)(auction_model_1.default, queryObj, properties);
    // const auction = await auctionModel.findOne(queryObj, properties).populate("items");
    return auction;
});
exports.getOneAuctionService = getOneAuctionService;
const getManyAuctionService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const auctions = yield (0, model_services_1.findManyService)(auction_model_1.default, objQuery, properties);
    return auctions;
});
exports.getManyAuctionService = getManyAuctionService;
const getAuctionByIdService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    let auction = yield getOneAuctionService({ _id: (0, model_services_1.createObjIdService)(auctionId) });
    auction = returnAuctionService(auction);
    yield returnAdditionalAuctionService(auction);
    return auction;
});
exports.getAuctionByIdService = getAuctionByIdService;
const getTopBidService = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const bids = yield (0, model_services_1.findManyService)(makeBid_model_1.default, {});
    const bidToAuction = bids.reduce((obj, cur) => {
        if (!obj[cur.auctionId]) {
            obj[cur.auctionId] = 1;
        }
        else {
            obj[cur.auctionId] += 1;
        }
        return obj;
    }, {});
    const idArr = Object.keys(bidToAuction);
    const topAuction = [];
    let limitAuction = idArr.length < limit ? idArr.length : limit;
    for (let i = 0; i < limitAuction; i++) {
        topAuction.push({
            auctionId: idArr[i],
            bidAmount: bidToAuction[idArr[i]],
        });
    }
    topAuction.sort((a, b) => {
        return b.bidAmount - a.bidAmount;
    });
    return topAuction;
});
exports.getTopBidService = getTopBidService;
const settleAuctionService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const auction = yield (0, model_services_1.deleteOneService)(auction_model_1.default, { _id: auctionId });
    const returnAuction = returnAuctionService(auction);
    return returnAuction;
});
exports.settleAuctionService = settleAuctionService;
const checkItemIsAuctionService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield (0, model_services_1.findOneService)(auction_model_1.default, { items: (0, model_services_1.createObjIdService)(itemId) }, "_id");
    if (check) {
        return true;
    }
    return false;
});
exports.checkItemIsAuctionService = checkItemIsAuctionService;
const updateAuctionStatusService = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = Math.round(Date.now() / 1000);
    yield (0, model_services_1.updateManyService)(auction_model_1.default, { expirationTime: { $lte: now } }, { isLive: false });
});
exports.updateAuctionStatusService = updateAuctionStatusService;
const returnAdditionalAuctionService = (auction) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, price_services_1.getTokenService)({ chainId: auction.chainId, tokenSymbol: auction.paymentToken });
    const getTokenPrice = (key, weiPrice, decimal) => {
        const obj = {};
        const result = (0, price_services_1.fromWeiToTokenService)(weiPrice, decimal);
        obj[key] = result;
        return obj;
    };
    const getUsdPrice = (key, token, weiPrice) => __awaiter(void 0, void 0, void 0, function* () {
        const obj = {};
        const result = yield (0, price_services_1.changePriceService)(token, "usd", weiPrice);
        obj[key] = result;
        return obj;
    });
    const getAmountOfBid = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, makeBid_services_1.getAmountBidService)(auctionId);
        return {
            amountBidder: result,
        };
    });
    const obj = yield (0, other_services_1.multiProcessService)([
        getTokenPrice("minPriceToken", auction.minPrice, token.decimal),
        getTokenPrice("highestBidToken", auction.highestBid, token.decimal),
        getUsdPrice("minPriceUsd", auction.paymentToken, auction.minPrice),
        getUsdPrice("highestBidUsd", auction.paymentToken, auction.highestBid),
        getAmountOfBid(auction.auctionId),
    ]);
    auction.minPrice = obj.minPriceToken;
    auction.highestBid = obj.highestBidToken;
    auction["minPriceUsd"] = obj.minPriceUsd;
    auction["highestBidUsd"] = obj.highestBidUsd;
    auction["amountBidder"] = obj.amountBidder;
});
const returnAuctionService = (auction) => {
    return {
        auctionId: auction._id,
        chainId: auction.chainId,
        collectionId: auction.collectionId,
        items: auction.items,
        highestBid: auction.highestBid,
        highestBidder: auction.highestBidder,
        minPrice: auction.minPrice,
        paymentToken: auction.paymentToken,
        expirationTime: auction.expirationTime,
        bidIncreasePercent: auction.bidIncreasePercent,
        seller: auction.seller,
        recipient: auction.recipient,
        isLive: auction.isLive,
    };
};
/* ******************************************
 *				BOARC 						*
 ********************************************/
const getAuctionByItemIdService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    let auction = yield getOneAuctionService({ items: (0, model_services_1.createObjIdService)(itemId) }, "");
    if (auction) {
        auction = returnAuctionService(auction);
        yield returnAdditionalAuctionService(auction);
    }
    return auction;
});
exports.getAuctionByItemIdService = getAuctionByItemIdService;
