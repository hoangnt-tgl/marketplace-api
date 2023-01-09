"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const collection_model_1 = __importDefault(require("./collection.model"));
const INO_model_1 = __importDefault(require("./INO.model"));
const item_model_1 = __importDefault(require("./item.model"));
const user_model_1 = __importDefault(require("./user.model"));
const Schema = mongoose_1.default.Schema;
const auctions = new Schema({
    chainId: { type: Number, required: true },
    listItemId: { type: Array },
    collectionId: { type: mongoose_1.default.Types.ObjectId, ref: collection_model_1.default },
    paymentToken: { type: String, lowercase: true },
    minPrice: { type: String, required: true },
    highestBid: { type: String, default: "0" },
    highestBidder: { type: String, default: default_constant_1.NULL_ADDRESS, lowercase: true },
    bidIncreasePercent: { type: Number, required: true },
    seller: { type: String, lowercase: true, required: true },
    refINO: { type: mongoose_1.default.Types.ObjectId, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    isLive: { type: Boolean, required: true },
    participant: { type: Array, default: [] },
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
auctions.index({ collectionId: 1 });
auctions.virtual("infoINO", {
    ref: INO_model_1.default,
    localField: "refINO",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
auctions.virtual("ownerInfo", {
    ref: user_model_1.default,
    localField: "seller",
    foreignField: "userAddress",
    justOne: true, // for many-to-1 relationships
});
auctions.virtual("items", {
    ref: item_model_1.default,
    localField: "listItemId",
    foreignField: "_id",
});
auctions.virtual("collectionInfo", {
    ref: collection_model_1.default,
    localField: "collectionId",
    foreignField: "_id",
    justOne: true,
});
exports.default = mongoose_1.default.model("auction", auctions);
