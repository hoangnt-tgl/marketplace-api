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
exports.getListBidderService = exports.getTopBidOfAuction = exports.checkBidExist = exports.deleteBidService = exports.getAmountBidService = exports.createBidService = void 0;
const makeBid_model_1 = __importDefault(require("../models/makeBid.model"));
const model_services_1 = require("./model.services");
const createBidService = (auctionId, userAddress, bidAmount, paymentToken, transactionHash) => __awaiter(void 0, void 0, void 0, function* () {
    const newBid = {
        auctionId: (0, model_services_1.createObjIdService)(auctionId),
        userAddress,
        bidAmount,
        paymentToken,
        transactionHash,
    };
    const bid = yield (0, model_services_1.createService)(makeBid_model_1.default, newBid);
    return bid;
});
exports.createBidService = createBidService;
const checkBidExist = (auctionId, userAddress, bidAmount, paymentToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(makeBid_model_1.default, { auctionId, userAddress, bidAmount, paymentToken });
});
exports.checkBidExist = checkBidExist;
const getTopBidOfAuction = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const bids = yield (0, model_services_1.findManyService)(makeBid_model_1.default, { auctionId }, "", { bidAmount: -1 });
    return bids[0];
});
exports.getTopBidOfAuction = getTopBidOfAuction;
const getAmountBidService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = yield (0, model_services_1.countByQueryService)(makeBid_model_1.default, { auctionId });
    return amount;
});
exports.getAmountBidService = getAmountBidService;
const getListBidderService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const biders = yield (0, model_services_1.findManyService)(makeBid_model_1.default, { auctionId }, "", { bidAmount: -1 });
    return biders;
});
exports.getListBidderService = getListBidderService;
const deleteBidService = (auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.deleteManyService)(makeBid_model_1.default, { auctionId });
    return result;
});
exports.deleteBidService = deleteBidService;
