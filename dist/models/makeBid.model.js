"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const Schema = mongoose_1.default.Schema;
const makeBid = new Schema({
    auctionId: { type: mongoose_1.default.Types.ObjectId, required: true },
    userAddress: { type: String, lowercase: true, require: true },
    bidAmount: { type: String, require: true },
    paymentToken: { type: String, required: true },
    transactionHash: { type: String, unique: true, require: true },
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
makeBid.virtual("userInfo", {
    ref: user_model_1.default,
    localField: "userAddress",
    foreignField: "userAddress",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("makeBids", makeBid);
