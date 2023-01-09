"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const INO_model_1 = __importDefault(require("./INO.model"));
const igo = new mongoose_1.default.Schema({
    inoId: { type: mongoose_1.default.Types.ObjectId, required: true },
    chainId: { type: Number, required: true },
    collectionId: { type: mongoose_1.default.Types.ObjectId, required: true, lowercase: true },
    listItem: { types: Array },
    limitItemPerUser: { type: Number, required: true },
    listPayment: { type: Array, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    participant: { type: Array, default: [] },
    totalVolume: { type: Number, default: 0 },
}, { timestamps: true, toObject: { virtuals: true } });
exports.default = mongoose_1.default.model("igo", igo);
igo.virtual("infoINO", {
    ref: INO_model_1.default,
    localField: "inoId",
    foreignField: "_id",
    justOne: true,
});
