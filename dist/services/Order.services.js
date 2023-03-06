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
exports.finalAuction = exports.getOneOrderService = exports.getOrderByInstantSaleFalseService = exports.getOrderByInstantSaleTrueService = exports.getOrderByItemIdService = exports.deleteOrderService = exports.getOrderByIdService = exports.createOrderService = exports.getAuctionIdService = exports.getCreationNumService = void 0;
const Order_model_1 = __importDefault(require("../models/Order.model"));
const model_services_1 = require("./model.services");
const axios_1 = __importDefault(require("axios"));
const other_services_1 = require("./other.services");
const getCreationNumService = (txn_hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let creationNumber = 0;
        yield new Promise(resolve => setTimeout(resolve, 1000));
        const response = yield axios_1.default.get(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${txn_hash}`);
        let data = response.data.events;
        data.forEach((element) => {
            if (element.type.includes("listing_utils::ListingEvent")) {
                creationNumber = element.data.id.creation_num;
            }
        });
        return creationNumber;
    }
    catch (error) {
        console.log(error.message);
        throw new Error("Error when get creation number");
    }
});
exports.getCreationNumService = getCreationNumService;
const getAuctionIdService = (txHash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let auctionId = 0;
        yield new Promise(resolve => setTimeout(resolve, 1000));
        const response = yield axios_1.default.get(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${txHash}`);
        let data = response.data.events;
        data.forEach((element) => {
            if (element.type.includes("auction::AuctionEvent")) {
                auctionId = element.data.auction_id;
            }
        });
        return auctionId;
    }
    catch (error) {
        console.log(error.message);
        throw new Error("Error when get creation number");
    }
});
exports.getAuctionIdService = getAuctionIdService;
const createOrderService = (chainId, maker, itemIdString, minPrice, coinType, creationNumber, amount, startTime, expirationTime, instantSale, auctionId) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = (0, model_services_1.createObjIdService)(itemIdString);
    const order = yield (0, model_services_1.createService)(Order_model_1.default, {
        chainId,
        maker,
        itemId,
        minPrice,
        coinType,
        creationNumber,
        amount,
        startTime,
        expirationTime,
        instantSale,
        auctionId,
    });
    return order;
});
exports.createOrderService = createOrderService;
const getOrderByIdService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_model_1.default.findOne({ _id: orderId })
        .lean()
        .populate({ path: "itemInfo", populate: "collectionInfo" });
    return order;
});
exports.getOrderByIdService = getOrderByIdService;
const deleteOrderService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, model_services_1.deleteOneService)(Order_model_1.default, { _id: orderId });
    return "Done";
});
exports.deleteOrderService = deleteOrderService;
const getOrderByItemIdService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_model_1.default.find({ itemId }).lean().populate("itemInfo");
    return orders;
});
exports.getOrderByItemIdService = getOrderByItemIdService;
const getOrderByInstantSaleTrueService = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_model_1.default.find({ instantSale: true }).lean().populate("itemInfo");
    return orders;
});
exports.getOrderByInstantSaleTrueService = getOrderByInstantSaleTrueService;
const getOrderByInstantSaleFalseService = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_model_1.default.find({ instantSale: false }).lean().populate("itemInfo");
    return orders;
});
exports.getOrderByInstantSaleFalseService = getOrderByInstantSaleFalseService;
const getOneOrderService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = (0, other_services_1.removeUndefinedOfObj)(query);
    const order = yield Order_model_1.default.findOne(query).lean().populate("itemInfo");
    return order;
});
exports.getOneOrderService = getOneOrderService;
const finalAuction = (txHash) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => setTimeout(resolve, 1000));
    const response = yield axios_1.default.get(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${txHash}`);
    let data = response.data.events;
    data.forEach((element) => {
        if (element.type.includes("::bid_utils::OrderExecutedEvent")) {
            // 	creationNumber = element.data.id.creation_num;
            console.log(element);
            console.log(123);
        }
    });
    // return creationNumber;
});
exports.finalAuction = finalAuction;
(0, exports.finalAuction)("0x0b708af2733acb7ed37f9593a192b9868c3c4b3be7207ae58d03f311c6340e41");
