"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const token = new Schema({
    chainId: { type: Number, required: true, default: 2 },
    tokenName: { type: String, lowercase: true },
    tokenSymbol: { type: String, lowercase: true },
    officialSymbol: { type: String },
    coingeckoId: { type: String, default: " " },
    tokenAddress: { type: String, lowercase: true },
    decimal: { type: Number, required: true },
    logoURI: { type: String, required: true },
    projectUrl: { type: String, default: " " },
    tokenType: { type: String }
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("tokens", token);
