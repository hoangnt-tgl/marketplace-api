"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("./item.model"));
const orderSchema = new mongoose_1.default.Schema({
    chainId: { type: Number, default: 2, required: true },
    maker: { type: String, required: true, lowercase: true },
    itemId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    minPrice: { type: String, required: true },
    coinType: { type: String, required: true, default: "apt" },
    creationNumber: { type: Number, required: true },
    amount: { type: Number, required: true },
    startTime: { type: String, required: true },
    expirationTime: { type: String, required: true },
    instantSale: { type: Boolean, required: true },
    auctionId: { type: String },
}, {
    timestamps: true,
    toObject: { virtuals: true }
});
orderSchema.index({ chainId: 1, maker: 1, type: 1, isDeleted: 1 });
orderSchema.index({ itemId: 1, type: 1, maker: 1, isDeleted: 1 });
orderSchema.index({ maker: 1 });
orderSchema.index({ chainId: 1, maker: 1 });
orderSchema.virtual("itemInfo", {
    ref: item_model_1.default,
    localField: "itemId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("order", orderSchema);
