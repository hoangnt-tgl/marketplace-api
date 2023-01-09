"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const item_model_1 = __importDefault(require("./item.model"));
const user_model_1 = __importDefault(require("./user.model"));
const collection_model_1 = __importDefault(require("./collection.model"));
const historySchema = new mongoose_1.default.Schema({
    collectionId: { type: mongoose_1.default.Types.ObjectId },
    itemId: { type: mongoose_1.default.Types.ObjectId },
    from: { type: String, default: default_constant_1.NULL_ADDRESS, lowercase: true },
    to: { type: String, default: default_constant_1.NULL_ADDRESS, lowercase: true },
    price: { type: String, default: "0" },
    priceType: { type: String, default: "eth" },
    quantity: { type: Number, default: 0 },
    txHash: { type: String },
    type: { type: Number },
}, { timestamps: true, toObject: { virtuals: true } });
historySchema.index({ chainId: 1, itemId: 1 });
historySchema.index({ chainId: 1, itemId: 1, type: 1 });
historySchema.index({ chainId: 1, type: 1 });
historySchema.index({ itemId: 1, type: 1 });
historySchema.virtual("itemInfo", {
    ref: item_model_1.default,
    localField: "itemId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
historySchema.virtual("fromUserInfo", {
    ref: user_model_1.default,
    localField: "from",
    foreignField: "userAddress",
    justOne: true
});
historySchema.virtual("toUserInfo", {
    ref: user_model_1.default,
    localField: "to",
    foreignField: "userAddress",
    justOne: true
});
historySchema.virtual("collectionInfo", {
    ref: collection_model_1.default,
    localField: "collectionId",
    foreignField: "_id",
    justOne: true
});
exports.default = mongoose_1.default.model("history", historySchema);
