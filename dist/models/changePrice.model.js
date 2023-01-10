"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const changePrice = new Schema({
    pair: { type: String, default: "eth-usd", unique: true },
    priceFeedContract: { type: String, lowercase: true },
    result: { type: Number, default: 0 },
    decimal: { type: Number, default: 18 },
}, {
    timestamps: true,
});
changePrice.index({ chainId: 1, pair: 1 });
exports.default = mongoose_1.default.model("changePrices", changePrice);
