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
exports.getListBidderController = exports.getTopBidController = exports.getAuctionByIdController = exports.queryAuctionController = exports.settleAuctionController = exports.createAuctionController = void 0;
const history_services_1 = require("../services/history.services");
const auction_services_1 = require("../services/auction.services");
const contract_constant_1 = require("../constant/contract.constant");
const makeBid_services_1 = require("../services/makeBid.services");
const item_services_1 = require("../services/item.services");
const provider_services_1 = require("../services/provider.services");
const web3_services_1 = require("../services/web3.services");
const price_services_1 = require("../services/price.services");
const createAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, collectionId, items, minPrice, expirationTime, bidIncreasePercent, paymentToken, seller, recipient, transactionHash, } = req.body;
    try {
        const web3 = (0, provider_services_1.getWeb3ByChainId)(parseInt(chainId));
        const check = yield (0, web3_services_1.isHex)(web3, paymentToken);
        let paymentTokenSymbol = paymentToken;
        if (check) {
            const token = yield (0, price_services_1.getTokenService)({ chainId, tokenAddress: paymentToken });
            paymentTokenSymbol = token.tokenSymbol;
        }
        const auction = yield (0, auction_services_1.createAuctionService)(parseInt(chainId), collectionId, items, minPrice, expirationTime, bidIncreasePercent, paymentTokenSymbol, seller, recipient);
        if (!auction) {
            return res.status(400).json({ error: "Failed to create auction" });
        }
        yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, item_services_1.updateStatusItemService)(item, { status: 2 });
            yield (0, history_services_1.createHistoryService)(collectionId, item, seller, contract_constant_1.EXCHANGE_ADDRESS[chainId], minPrice, paymentTokenSymbol, transactionHash, 8);
        })));
        return res.status(200).json(auction);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createAuctionController = createAuctionController;
const getAuctionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auctionId } = req.params;
        const auction = yield (0, auction_services_1.getAuctionByIdService)(auctionId);
        return res.status(200).json(auction);
    }
    catch (error) { }
    return res.status(500).json({ error: "Can't get auction" });
});
exports.getAuctionByIdController = getAuctionByIdController;
const getTopBidController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit } = req.params;
    try {
        const auctions = yield (0, auction_services_1.getTopBidService)(parseInt(limit));
        return res.status(200).json(auctions);
    }
    catch (error) { }
    return res.status(500).json({ error: "Can't get top bid" });
});
exports.getTopBidController = getTopBidController;
const getListBidderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId } = req.params;
    try {
        const bidders = yield (0, makeBid_services_1.getListBidderService)(auctionId);
        return res.status(200).json(bidders);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot get list of bidder" });
});
exports.getListBidderController = getListBidderController;
const settleAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId } = req.params;
    const { transactionHash } = req.body;
    if (!transactionHash) {
        return res.status(400).json({ error: "Missing transaction hash" });
    }
    try {
        const auction = yield (0, auction_services_1.settleAuctionService)(auctionId);
        const bids = yield (0, makeBid_services_1.deleteBidService)(auctionId);
        if (auction && bids) {
            auction.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    (0, item_services_1.updateOwnerItemService)(item, auction.highestBidder),
                    (0, item_services_1.updateStatusItemService)(item, 0),
                    (0, history_services_1.createHistoryService)(auction.collectionId, item, contract_constant_1.AUCTION_ADDRESS[auction.chainId], auction.highestBidder, "0", auction.paymentToken, transactionHash.toString(), 9),
                    (0, history_services_1.createHistoryService)(auction.collectionId, item, contract_constant_1.AUCTION_ADDRESS[auction.chainId], auction.seller, auction.highestBid, auction.paymentToken, transactionHash.toString(), 4),
                ].map((func) => __awaiter(void 0, void 0, void 0, function* () {
                    yield func;
                })));
            }));
            return res.status(200).json(auction);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Cannot delete auction" });
});
exports.settleAuctionController = settleAuctionController;
const queryAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { chainId, isLive, collectionId, itemId } = req.body;
    try {
        const auctions = yield (0, auction_services_1.queryAuctionService)(chainId, isLive, collectionId, itemId, parseInt(pageId), parseInt(pageSize));
        if (auctions) {
            return res.status(200).json(auctions);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Cannot get auctions" });
});
exports.queryAuctionController = queryAuctionController;
