"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auction_model_1 = __importDefault(require("./auction.model"));
const Schema = mongoose_1.default.Schema;
const makeBid = new Schema({
    auctionId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: auction_model_1.default,
    },
    userAddress: {
        type: String,
        lowercase: true,
    },
    bidAmount: {
        type: String,
    },
    priceType: {
        type: String,
    },
    transactionHash: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("makeBids", makeBid);
