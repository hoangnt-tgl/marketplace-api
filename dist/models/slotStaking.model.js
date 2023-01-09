"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("./item.model"));
const slotStaking = new mongoose_1.default.Schema({
    itemId: { type: mongoose_1.default.Types.ObjectId, required: true },
    chainId: { type: Number, required: true },
    slotIndex: { type: Number, required: true },
    option: { type: Number, required: true },
    itemAmount: { type: Number, required: true },
    startTime: { type: Number, required: true },
    userAddress: { type: String, required: true, lowercase: true },
    isHarvest: { type: Boolean, default: false },
    reward: { type: Number, default: 0 },
    ticketCardId: { type: String, required: true },
    ticketCardAmount: { type: Number, default: 0 },
}, { timestamps: true, toObject: { virtuals: true } });
slotStaking.virtual("itemInfo", {
    ref: item_model_1.default,
    localField: "itemId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
slotStaking.virtual("ticketInfo", {
    ref: item_model_1.default,
    localField: "ticketCardId",
    foreignField: "_id",
    justOne: true,
});
exports.default = mongoose_1.default.model("slotStaking", slotStaking);
