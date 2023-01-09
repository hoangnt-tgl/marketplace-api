"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const collection_model_1 = __importDefault(require("./collection.model"));
const item_model_1 = __importDefault(require("./item.model"));
const Schema = mongoose_1.default.Schema;
const auctions = new Schema({
    chainId: {
        type: Number,
    },
    items: {
        type: Array,
        ref: item_model_1.default,
    },
    collectionId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: collection_model_1.default,
    },
    paymentToken: {
        type: String,
        lowercase: true,
    },
    minPrice: {
        type: String,
    },
    highestBid: {
        type: String,
        default: "0",
    },
    highestBidder: {
        type: String,
        default: default_constant_1.NULL_ADDRESS,
        lowercase: true,
    },
    bidIncreasePercent: {
        type: Number,
    },
    expirationTime: {
        type: Number,
    },
    seller: {
        type: String,
        lowercase: true,
    },
    recipient: {
        type: String,
        default: default_constant_1.NULL_ADDRESS,
        lowercase: true,
    },
    isLive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
auctions.index({ collectionId: 1 });
auctions.index({ items: 1 });
exports.default = mongoose_1.default.model("auction", auctions);
