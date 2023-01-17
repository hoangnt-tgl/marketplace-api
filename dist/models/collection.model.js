"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const user_model_1 = __importDefault(require("./user.model"));
const Schema = mongoose_1.default.Schema;
// Custom type isINO Boolean to Number
const collections = new Schema({
    collectionAddress: { type: String, lowercase: true },
    userAddress: { type: String, lowercase: true, required: true },
    logo: { type: String, required: true },
    background: { type: String },
    collectionName: { type: String, required: true },
    chainId: { type: Number, required: true },
    collectionStandard: { type: String, default: default_constant_1.DEFAULT_STANDARD },
    volumeTrade: { type: Number, default: 0 },
    royalties: { type: Number, default: 0 },
    description: { type: String, default: "" },
    category: { type: Number, default: default_constant_1.DEFAULT_ITEM_CATEGORY },
    isConfirm: { type: Boolean, default: true },
    isINO: { type: Number, default: 0 },
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
collections.index({ collectionAddress: 1 });
collections.index({ collectionAddress: 1, userAddress: 1 });
collections.index({ userAddress: 1 });
collections.index({ userAddress: 1, chainId: 1 });
collections.index({ chainId: 1, userAddress: 1, collectionName: 1 });
collections.index({ chainId: 1 });
collections.index({ chainId: 1, userAddress: 1 });
collections.virtual("ownerInfo", {
    ref: user_model_1.default,
    localField: "userAddress",
    foreignField: "userAddress",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("collection", collections);
