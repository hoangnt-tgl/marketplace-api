"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    userAddress: { type: String, required: true },
    type: { type: Number, required: true },
    detail: { type: String, default: '' },
    isWatched: { type: Boolean, default: false, required: true },
    objectId: { type: mongoose_1.default.Types.ObjectId },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
notificationSchema.index({ userAddress: 1 });
notificationSchema.index({ userAddress: 1, objectId: 1 });
exports.default = mongoose_1.default.model("notification", notificationSchema);
