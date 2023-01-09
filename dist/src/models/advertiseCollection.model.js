"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const advertiseCollection = new Schema({
    collectionId: { type: mongoose_1.default.Types.ObjectId, unique: true },
    mainImage: { type: String },
    secondaryImage: { type: String },
    expireAt: { type: Date },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("advertiseCollection", advertiseCollection);
