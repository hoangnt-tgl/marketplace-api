"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*------------Add Schema Collection Info-----------------*/
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const collectionInfo = new Schema({
    collectionId: { type: mongoose_1.default.Types.ObjectId, required: true },
    image: { type: String },
    logo: { type: String },
    tittle: { type: String },
    totalNFT: { type: Number },
    availableNFT: { type: Number },
    chainId: { type: String },
    price: { type: Number },
    symbolPrice: { type: String },
    owner: { type: Number, default: 0 },
    totalSales: { type: Number },
    status: { type: Boolean },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    benefits: { type: Array, required: true },
    creator: { type: String, require: true },
    ERC: { type: String, require: true },
    item: { type: Array, default: [] },
    content: { type: Object, required: true },
    socialMedia: { type: Object, required: true },
    active: { type: Boolean },
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
exports.default = mongoose_1.default.model("collectionInfo", collectionInfo);
