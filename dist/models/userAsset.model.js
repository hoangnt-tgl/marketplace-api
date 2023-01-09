"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("./item.model"));
const userAsset = new mongoose_1.default.Schema({
    userAddress: { type: String, lowercase: true, required: true },
    itemId: { type: mongoose_1.default.Types.ObjectId, required: true },
    positionName: { type: String, required: true },
    templateId: { type: mongoose_1.default.Types.ObjectId, required: true },
}, { timestamps: true, toObject: { virtuals: true } });
userAsset.virtual("itemInfo", {
    ref: item_model_1.default,
    localField: "itemId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("userAsset", userAsset);
