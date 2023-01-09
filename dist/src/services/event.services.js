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
exports.getPastMadeBidEvent = exports.listenMadeBidEvent = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const auction_model_1 = __importDefault(require("../models/auction.model"));
const auction_services_1 = require("./auction.services");
const collection_services_1 = require("./collection.services");
const contract_services_1 = require("./contract.services");
const item_services_1 = require("./item.services");
const makeBid_services_1 = require("./makeBid.services");
const model_services_1 = require("./model.services");
const listenMadeBidEvent = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield (0, contract_services_1.getAuctionContractService)(chainId);
        contract.events.BidMade({ filter: {}, fromBlock: "latest" }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(`Listen made bid event error with message: ${err}`);
            }
            else {
                newBidEvent(data, chainId, false);
            }
        }));
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.listenMadeBidEvent = listenMadeBidEvent;
const newBidEvent = (event, chainId, isPast) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionAddress = event.returnValues.nftContractAddress;
    const itemTokenId = event.returnValues.tokenId;
    const bidder = event.returnValues.bidder;
    const amount = event.returnValues.amount;
    const paymentToken = event.returnValues.paymentToken;
    const transactionHash = event.transactionHash;
    let itemId;
    let collectionId;
    let item, collection;
    try {
        if (contract_constant_1.COLLECTION_ADDRESS[chainId].toLowerCase() === collectionAddress.toLowerCase()) {
            item = yield (0, item_services_1.getOneItemService)({ itemTokenId, chainId }, "_id collectionId");
        }
        else {
            let collection = yield (0, collection_services_1.getOneCollectionService)({ collectionAddress, chainId }, "_id");
            if (collection) {
                item = yield (0, item_services_1.getOneItemService)({ collectionId: collection.collectionId, itemTokenId, chainId }, "_id");
            }
        }
        if (collection && item) {
            itemId = item.itemId;
            collectionId = collection.collectionId;
        }
        const auction = yield (0, model_services_1.findOneService)(auction_model_1.default, { items: itemId, collectionId }, "_id paymentToken");
        if (auction) {
            if (isPast) {
                const check = yield (0, makeBid_services_1.checkBidExist)(auction._id, bidder, amount, paymentToken);
                if (!check) {
                    yield (0, makeBid_services_1.createBidService)(auction._id, bidder, amount, paymentToken, transactionHash);
                }
            }
            else {
                yield (0, auction_services_1.makeBidService)(auction._id, amount, bidder);
                yield (0, makeBid_services_1.createBidService)(auction._id, bidder, amount, paymentToken, transactionHash);
            }
        }
    }
    catch (error) {
        console.log("new bid event: ", error.message);
    }
});
const getPastMadeBidEvent = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield (0, contract_services_1.getAuctionContractService)(chainId);
        let options = {
            filter: {},
            fromBlock: 0,
            toBlock: "latest",
        };
        let result = yield contract.getPastEvents("BidMade", options);
        yield Promise.all(result.map((bid) => __awaiter(void 0, void 0, void 0, function* () {
            yield newBidEvent(bid, chainId, true);
        })));
        const auctions = yield (0, model_services_1.findManyService)(auction_model_1.default, { chainId }, "_id");
        yield Promise.all(auctions.map((auction) => __awaiter(void 0, void 0, void 0, function* () {
            let bid = yield (0, makeBid_services_1.getTopBidOfAuction)(auction._id);
            if (bid) {
                yield (0, auction_services_1.makeBidService)(auction._id, bid.bidAmount, bid.userAddress);
            }
        })));
        return result;
    }
    catch (error) {
        console.log("getAllBider Error: ", error.message);
    }
});
exports.getPastMadeBidEvent = getPastMadeBidEvent;
