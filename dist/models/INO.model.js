"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const collection_model_1 = __importDefault(require("./collection.model"));
const item_model_1 = __importDefault(require("./item.model"));
const modelINO = new mongoose_1.default.Schema({
    chainId: { type: Number, required: true },
    addressINO: { type: String, required: true, lowercase: true },
    collectionId: { type: mongoose_1.default.Types.ObjectId, require: true },
    listItemId: { type: Array, require: true },
    nameINO: { type: String, required: true },
    ownerINO: { type: String, required: true, lowercase: true },
    descriptionINO: { type: String, required: true },
    typeINO: { type: Number, required: true },
    floorPoint: { type: Number, default: 0 },
    isComplete: { type: Boolean, default: false },
    thumbnails: { type: Array, default: [] },
}, {
    timestamps: true,
    toObject: { virtuals: true }
});
modelINO.virtual("items", {
    ref: item_model_1.default,
    localField: "listItemId",
    foreignField: "_id",
});
modelINO.virtual("collectionInfo", {
    ref: collection_model_1.default,
    localField: "collectionId",
    foreignField: "_id",
    justOne: true,
});
exports.default = mongoose_1.default.model("modelINO", modelINO);
