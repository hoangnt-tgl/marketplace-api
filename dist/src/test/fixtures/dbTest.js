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
exports.setupDBTest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const default_constant_1 = require("../../constant/default.constant");
const firstUser = {
    userAddress: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
};
const firstCollection = {
    _id: new mongoose_1.default.Types.ObjectId(),
    userAddress: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
    logo: default_constant_1.DEFAULT_PICTURE,
    background: default_constant_1.DEFAULT_PICTURE,
    collectionName: "Collection 1",
    chainId: 4,
    collectionStandard: default_constant_1.DEFAULT_STANDARD,
    description: "Test First Collection",
};
const firstItem = {
    _id: new mongoose_1.default.Types.ObjectId(),
    itemName: "Item 1",
    itemMedia: default_constant_1.DEFAULT_PICTURE,
    owner: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
    creator: "0x236A2B176FAC613b1c1091cA2EcA2915b07e9492",
    status: default_constant_1.DEFAULT_ITEM_STATUS,
    category: default_constant_1.DEFAULT_ITEM_CATEGORY,
    collectionId: firstCollection._id,
    collectionAddress: 4,
    itemStandard: default_constant_1.DEFAULT_STANDARD,
    chainId: 4,
};
const firstOrder = {
    maker: "333",
    taker: "222",
    makerRelayerFee: 123,
    takerRelayerFee: 100,
    side: 99,
    saleKind: 3,
    target: "gamek.com",
    howToCall: 2,
    callData: "uuu",
    replacementPattern: "@@",
    staticTarget: "test.com",
    extraData: "no",
    basePrice: 111,
    extra: 1,
    listingTime: 1,
    expirationTime: 3,
    salt: "111",
    orderBaseId: "82834234adas",
    signatureId: "sdsdf923adfs",
    itemId: "dffdsfdsfds",
    paymentToken: "ETH",
};
const setupDBTest = () => __awaiter(void 0, void 0, void 0, function* () {
    // await userModel.deleteMany({})
    // await orderModel.deleteMany({})
    // await collectionModel.deleteMany({})
    // await itemModel.deleteMany({})
    // await new userModel(firstUser).save();
    yield new user_model_1.default(firstCollection).save();
    // await new orderModel(firstOrder).save();
    // await new itemModel(firstItem).save();
});
exports.setupDBTest = setupDBTest;
