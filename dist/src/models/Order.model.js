"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const order_constant_1 = require("../constant/order.constant");
const item_model_1 = __importDefault(require("./item.model"));
const orderSchema = new mongoose_1.default.Schema({
    chainId: { type: Number, default: 4, required: true },
    maker: { type: String, required: true, lowercase: true },
    taker: { type: String, default: order_constant_1.ORDER_CONFIGURATION.NULL_ADDRESS, lowercase: true },
    makerRelayerFee: { type: String, required: true },
    takerRelayerFee: { type: String, default: "0" },
    feeRecipient: { type: String, default: order_constant_1.ORDER_CONFIGURATION.FEE_RECIPIENT, required: true },
    side: { type: Number, required: true },
    saleKind: { type: Number, required: true },
    target: { type: String, required: true, lowercase: true },
    itemId: { type: String, required: true, ref: item_model_1.default },
    howToCall: { type: Number, default: 0 },
    callData: { type: String, required: true },
    replacementPattern: { type: String, required: true },
    staticTarget: { type: String, default: order_constant_1.ORDER_CONFIGURATION.NULL_ADDRESS, lowercase: true },
    staticExtraData: { type: String, default: "0x" },
    paymentToken: { type: String, default: order_constant_1.ORDER_CONFIGURATION.NULL_ADDRESS },
    basePrice: { type: String, required: true },
    extra: { type: String, default: "0" },
    listingTime: { type: String, required: true },
    expirationTime: { type: String, default: "0" },
    salt: { type: String, required: true },
    feeMethod: { type: Number, default: 1 },
    makerProtocolFee: { type: String, default: order_constant_1.ORDER_CONFIGURATION.FIXED_MAKER_PROTOCOL_FEE },
    takerProtocolFee: { type: String, default: order_constant_1.ORDER_CONFIGURATION.FIXED_TAKER_PROTOCOL_FEE },
    r: { type: String, required: true },
    s: { type: String, required: true },
    v: { type: String, required: true },
    type: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
orderSchema.index({ chainId: 1, maker: 1, type: 1, isDeleted: 1 });
orderSchema.index({ itemId: 1, type: 1, maker: 1, isDeleted: 1 });
orderSchema.index({ maker: 1 });
orderSchema.index({ chainId: 1, maker: 1 });
exports.default = mongoose_1.default.model("order", orderSchema);
