"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const collection_model_1 = __importDefault(require("./collection.model"));
const user_model_1 = __importDefault(require("./user.model"));
const Schema = mongoose_1.default.Schema;
const items = new Schema({
    itemTokenId: { type: String },
    itemName: { type: String, required: true },
    description: { type: String, default: "" },
    itemMedia: { type: String, default: default_constant_1.DEFAULT_PICTURE },
    itemOriginMedia: { type: String, default: "" },
    itemPreviewMedia: { type: String, default: "" },
    external_url: { type: String, default: "" },
    metadata: { type: String, default: "" },
    properties: { type: Object, default: null },
    owner: { type: Array, default: [], lowercase: true },
    creator: { type: String, default: default_constant_1.NULL_ADDRESS, lowercase: true },
    status: { type: Number, default: default_constant_1.DEFAULT_ITEM_STATUS },
    offer_status: { type: Number, default: default_constant_1.DEFAULT_OFFER_ITEM_STATUS },
    price: { type: String, default: "0" },
    priceType: { type: String, default: "apt" },
    collectionId: { type: mongoose_1.default.Types.ObjectId, required: true },
    itemStandard: { type: String, default: default_constant_1.DEFAULT_STANDARD },
    chainId: { type: Number, required: true },
    isFreeze: { type: Boolean, default: false },
    isINO: { type: Number, default: 0 },
    royalties: { type: Number, default: 0 },
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
items.index({ status: 1, owner: 1, creator: 1, collectionId: 1, chainId: 1 });
items.index({ itemName: "text" });
items.index({ category: 1 });
items.index({ itemTokenId: 1 });
items.index({ chainId: 1, collectionId: 1 });
items.index({ chainId: 1, userAddress: 1 });
items.index({ chainId: 1, status: 1 });
items.index({ chainId: 1, collectionId: 1, userAddress: 1 });
items.index({ chainId: 1, collectionId: 1, userAddress: 1 });
items.index({ listingPrice: 1 });
items.index({ price: 1 });
items.index({ category: 1 });
items.virtual("ownerInfo", {
    ref: user_model_1.default,
    localField: "owner",
    foreignField: "userAddress",
});
items.virtual("collectionInfo", {
    ref: collection_model_1.default,
    localField: "collectionId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
items.virtual("creatorInfo", {
    ref: user_model_1.default,
    localField: "creator",
    foreignField: "userAddress",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("item", items);
