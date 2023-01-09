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
exports.auctionParticipateController = exports.getListBidderController = exports.getTopBidController = exports.getAuctionByIdController = exports.queryAuctionController = exports.makeBidController = exports.settleAuctionController = exports.createAuctionController = void 0;
const history_services_1 = require("../services/history.services");
const auction_services_1 = require("../services/auction.services");
const contract_constant_1 = require("../constant/contract.constant");
const makeBid_services_1 = require("../services/makeBid.services");
const item_services_1 = require("../services/item.services");
const provider_services_1 = require("../services/provider.services");
const web3_services_1 = require("../services/web3.services");
const price_services_1 = require("../services/price.services");
const INO_service_1 = require("../services/INO.service");
const response_constants_1 = require("../constant/response.constants");
const model_services_1 = require("../services/model.services");
const auction_model_1 = __importDefault(require("../models/auction.model"));
const other_services_1 = require("../services/other.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const createAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, chainId, nameINO, descriptionINO, collectionId, listItemId, minPrice, bidIncreasePercent, paymentToken, transactionHash, endTime, startTime, } = req.body;
    try {
        const ino = yield (0, INO_service_1.createINOService)(chainId, collectionId, listItemId, contract_constant_1.MetaSpacecyAuction[chainId], userAddress, nameINO, descriptionINO, 1, 0);
        const web3 = (0, provider_services_1.getWeb3ByChainId)(ino.chainId);
        const check = (0, web3_services_1.isHex)(web3, paymentToken);
        let paymentTokenSymbol = paymentToken;
        if (check) {
            const token = yield (0, price_services_1.getTokenService)({ chainId: ino.chainId, tokenAddress: paymentToken });
            paymentTokenSymbol = token.tokenSymbol;
        }
        const auction = yield (0, auction_services_1.createAuctionService)(chainId, ino._id, collectionId, listItemId, minPrice, bidIncreasePercent, paymentToken, userAddress, endTime, startTime);
        yield Promise.all(listItemId.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, item_services_1.updateStatusItemService)(item, { status: 2 });
            yield (0, history_services_1.createHistoryService)(ino.collectionId, item, ino.ownerINO, contract_constant_1.MetaSpacecyAuction[ino.chainId], minPrice, paymentTokenSymbol, 1, transactionHash, 8);
        })));
        const response = { data: auction };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createAuctionController = createAuctionController;
const settleAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, auctionId, collectionId, paymentToken, transactionHash, } = req.body;
    try {
        const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
        const check = (0, web3_services_1.isHex)(web3, paymentToken);
        let paymentTokenSymbol = paymentToken;
        const auction = yield (0, model_services_1.findOneService)(auction_model_1.default, { _id: (0, model_services_1.createObjIdService)(auctionId) });
        yield (0, INO_service_1.updateINOCompleteService)(auction.refINO);
        if (check) {
            const token = yield (0, price_services_1.getTokenService)({ chainId: chainId, tokenAddress: paymentToken });
            paymentTokenSymbol = token.tokenSymbol;
        }
        if (auction) {
            yield Promise.all(auction.listItemId.map((itemId) => __awaiter(void 0, void 0, void 0, function* () {
                const item = yield item_model_1.default.findOne({ _id: (0, model_services_1.createObjIdService)(itemId) });
                yield (0, other_services_1.multiProcessService)([
                    (0, item_services_1.updateOwnerItemService)(itemId.toString(), auction.highestBidder),
                    (0, item_services_1.updateStatusItemService)(item, { status: 0, isINO: false }),
                    (0, history_services_1.createHistoryService)(collectionId, itemId.toString(), contract_constant_1.MetaSpacecyAuction[chainId], auction.highestBidder, "0", paymentTokenSymbol, 1, transactionHash, 9),
                    (0, history_services_1.createHistoryService)(collectionId, itemId.toString(), contract_constant_1.MetaSpacecyAuction[chainId], auction.seller, auction.highestBid, paymentTokenSymbol, 1, transactionHash, 4)
                ]);
            })));
        }
        yield (0, makeBid_services_1.deleteBidService)(auction._id);
        yield (0, auction_services_1.settleAuctionService)(auction._id);
        const response = { data: auction };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.settleAuctionController = settleAuctionController;
const makeBidController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId, listItemId, collectionId, userAddress, bidAmount, paymentToken, transactionHash, } = req.body;
    try {
        yield (0, auction_services_1.makeBidService)(auctionId, bidAmount, userAddress);
        yield (0, makeBid_services_1.createBidService)(auctionId, userAddress, bidAmount, paymentToken, transactionHash);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.makeBidController = makeBidController;
const getAuctionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auctionId } = req.params;
        const { userAddress } = req.query || "";
        const auction = yield (0, auction_services_1.getAuctionByIdService)(auctionId, userAddress);
        return res.status(200).json({ data: auction });
    }
    catch (error) {
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getAuctionByIdController = getAuctionByIdController;
const getTopBidController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit } = req.params;
    try {
        const auctions = yield (0, auction_services_1.getTopBidService)(parseInt(limit));
        return res.status(200).json(auctions);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getTopBidController = getTopBidController;
const getListBidderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId } = req.params;
    try {
        const bidders = yield (0, makeBid_services_1.getListBidderService)(auctionId);
        return res.status(200).json({ data: bidders });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getListBidderController = getListBidderController;
const queryAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { textSearch, userAddress, chainId, status } = req.body;
    try {
        const auctions = yield (0, auction_services_1.queryAuctionService)(textSearch, chainId, userAddress, status, Number(pageId), Number(pageSize));
        if (auctions) {
            return res.status(200).json(auctions);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.queryAuctionController = queryAuctionController;
const auctionParticipateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionId, userAddress, isJoin } = req.body;
    try {
        const result = yield (0, auction_services_1.auctionParticipateService)(auctionId, userAddress, isJoin);
        if (result) {
            return res.status(200).json({ data: result });
        }
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.auctionParticipateController = auctionParticipateController;
