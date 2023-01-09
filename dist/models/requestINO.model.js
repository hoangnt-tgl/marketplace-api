"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requestINO = new mongoose_1.default.Schema({
    companyName: { type: String, required: true },
    projectName: { type: String, required: true },
    projectWebsite: { type: String, default: "" },
    email: { type: String, required: true },
    network: { type: Number, required: true },
    walletAddress: { type: String, required: true, lowercase: true },
    collectionAddress: { type: String, default: 0, lowercase: true },
    collectionId: { type: mongoose_1.default.Types.ObjectId, default: "" },
    listItemId: { type: Array, default: [] },
    typeINO: { type: Number, required: true },
    projectDescription: { type: String, default: "" },
    isApprove: { type: Boolean, default: false },
    isPin: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    startTime: { type: Number, default: 0 },
    endTime: { type: Number, default: 0 },
    nativeTokenName: { type: String, default: "" },
    nativeTokenPrice: { type: String, default: "" },
    protocolTokenName: { type: String, default: "" },
    protocolTokenPrice: { type: String, default: "" },
    stableTokenName: { type: String, default: "" },
    stableTokenPrice: { type: String, default: "" },
    deleteTime: { type: Number, default: 0 },
}, { timestamps: true, toObject: { virtuals: true } });
exports.default = mongoose_1.default.model("requestINO", requestINO);
