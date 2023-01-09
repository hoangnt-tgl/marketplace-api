"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("../models/item.model"));
const auction_model_1 = __importDefault(require("../models/auction.model"));
const notificationSchema = new mongoose_1.default.Schema({
    title: { type: String, require: true },
    type: { type: Number, required: true },
    interactWith: { type: String, require: true },
    content: { type: String, default: "" },
    objectId: { type: mongoose_1.default.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, toObject: { virtuals: true } });
notificationSchema.virtual("itemInfo", {
    ref: item_model_1.default,
    localField: "objectId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
notificationSchema.virtual("auctionInfo", {
    ref: auction_model_1.default,
    localField: "objectId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("notification", notificationSchema);
