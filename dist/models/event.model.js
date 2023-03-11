"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_constant_1 = require("./../constant/default.constant");
const mongoose_1 = __importStar(require("mongoose"));
const item_model_1 = __importDefault(require("./item.model"));
const EventModel = new mongoose_1.Schema({
    question: { type: String, require: true },
    image: { type: String, require: true },
    description: { type: String, require: true },
    chainId: { type: String, require: true, default: default_constant_1.DEFAULT_CHAIN_ID },
    liquidity: { type: String },
    category: { type: String },
    options: [{ name: { type: String }, value: { type: Number, default: 0 } }],
    marketFee: { type: Number, default: 0 },
    coinType: { type: String, default: default_constant_1.DEFAULT_COIN_TYPE },
    startTime: { type: String, require: true },
    endTime: { type: String, require: true },
    itemId: { type: (Array) },
}, {
    timestamps: true,
});
EventModel.virtual("itemInfo", {
    ref: item_model_1.default,
    localField: "itemId",
    foreignField: "_id",
});
exports.default = mongoose_1.default.model("event", EventModel);
