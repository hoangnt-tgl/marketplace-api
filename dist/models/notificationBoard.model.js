"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notification_model_1 = __importDefault(require("./notification.model"));
const user_model_1 = __importDefault(require("./user.model"));
const notificationBoardSchema = new mongoose_1.default.Schema({
    userAddress: { type: String, require: true },
    isWatched: { type: Boolean, require: true, default: false },
    notificationId: { type: mongoose_1.default.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, toObject: { virtuals: true } });
notificationBoardSchema.virtual("notificationInfo", {
    ref: notification_model_1.default,
    localField: "notificationId",
    foreignField: "_id",
    justOne: true, // for many-to-1 relationships
});
notificationBoardSchema.virtual("user", {
    ref: user_model_1.default,
    localField: "userAddress",
    foreignField: "userAddress",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("notificationBoard", notificationBoardSchema);
