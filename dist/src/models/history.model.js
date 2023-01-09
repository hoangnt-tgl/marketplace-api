"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const historySchema = new mongoose_1.default.Schema({
    collectionId: { type: mongoose_1.default.Types.ObjectId },
    itemId: { type: mongoose_1.default.Types.ObjectId },
    from: { type: String, default: default_constant_1.NULL_ADDRESS, lowercase: true },
    to: { type: String, default: default_constant_1.NULL_ADDRESS, lowercase: true },
    price: { type: String, default: "0" },
    priceType: { type: String, default: "eth" },
    txHash: { type: String },
    type: { type: Number },
}, { timestamps: true });
historySchema.index({ chainId: 1, itemId: 1 });
historySchema.index({ chainId: 1, itemId: 1, type: 1 });
historySchema.index({ chainId: 1, type: 1 });
historySchema.index({ itemId: 1, type: 1 });
exports.default = mongoose_1.default.model("history", historySchema);
