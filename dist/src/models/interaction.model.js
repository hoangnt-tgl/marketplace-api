"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const interactions = new Schema({
    userAddress: {
        type: String,
        lowercase: true
    },
    itemId: {
        type: mongoose_1.default.Types.ObjectId,
    },
    state: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
interactions.index({ userAddress: 1, itemId: 1 });
interactions.index({ itemId: 1, state: 1 });
exports.default = mongoose_1.default.model("interactions", interactions);
