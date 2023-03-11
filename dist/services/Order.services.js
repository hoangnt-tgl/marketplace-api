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
const item_model_1 = __importDefault(require("../models/item.model"));
const aptos_services_1 = require("./aptos.services");
const item_services_1 = require("./item.services");
const getCreationNumService = (txn_hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let creationNumber = 0;
        yield new Promise(resolve => setTimeout(resolve, 500));
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
        yield new Promise(resolve => setTimeout(resolve, 500));
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
const finalAuction = (txHash, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let buyer = "";
        let lister = "";
        let price = "";
        yield new Promise(resolve => setTimeout(resolve, 500));
        const response = yield axios_1.default.get(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${txHash}`);
        let data = response.data.events;
        data.forEach((element) => {
            if (element.type.includes("::bid_utils::OrderExecutedEvent")) {
                buyer = element.data.buyer;
                lister = element.data.lister_address;
                price = element.data.executed_price;
            }
        });
        let itemInfo = yield (0, item_services_1.getOneItemService)({ _id: itemId });
        if (!itemInfo) {
            return;
        }
        let owners = itemInfo.owner;
        if (!owners.includes(buyer)) {
            owners.push(buyer);
        }
        let balanceLister = yield (0, aptos_services_1.getBalanceTokenForAccount)(lister, itemInfo.creator, itemInfo.collectionInfo.collectionName, itemInfo.itemName, "2");
        if (balanceLister === "0") {
            owners = owners.filter(ele => ele !== lister);
        }
        yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, { owner: owners });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.finalAuction = finalAuction;
