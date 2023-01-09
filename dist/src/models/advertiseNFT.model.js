"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const item_model_1 = __importDefault(require("./item.model"));
const Schema = mongoose_1.default.Schema;
const advertiseNFT = new Schema({
    itemId: { type: mongoose_1.default.Types.ObjectId, unique: true, ref: item_model_1.default },
    expireAt: { type: Date },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("advertiseNFT", advertiseNFT);
