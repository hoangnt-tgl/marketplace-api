"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const blacklist_model_1 = __importDefault(require("./blacklist.model"));
const Schema = mongoose_1.default.Schema;
const users = new Schema({
    userAddress: { type: String, lowercase: true, required: true, unique: true },
    avatar: { type: String, default: default_constant_1.DEFAULT_AVATAR },
    background: { type: String, default: default_constant_1.DEFAULT_PICTURE },
    username: { type: String, default: default_constant_1.DEFAULT_NAME },
    email: { type: String, default: "" },
    social: { type: String, default: "" },
    bio: { type: String, default: "Introduce yourself to everyone" },
    signature: { type: String, default: "" },
    signature_expired_time: { type: String, default: "" },
}, {
    timestamps: true,
    toObject: { virtuals: true },
});
users.index({ userAddress: 1 });
users.index({ username: "text" });
users.virtual("userInBlackList", {
    ref: blacklist_model_1.default,
    localField: "userAddress",
    foreignField: "userAddress",
    justOne: true, // for many-to-1 relationships
});
exports.default = mongoose_1.default.model("user", users);
