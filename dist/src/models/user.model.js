"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const default_constant_1 = require("../constant/default.constant");
const Schema = mongoose_1.default.Schema;
const users = new Schema({
    userAddress: {
        type: String,
        lowercase: true,
    },
    avatar: {
        type: String,
        default: default_constant_1.DEFAULT_AVATAR,
    },
    background: {
        type: String,
        default: default_constant_1.DEFAULT_PICTURE,
    },
    username: {
        type: String,
        default: default_constant_1.DEFAULT_NAME,
    },
    email: {
        type: String,
        default: "",
    },
    social: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    nonce: {
        type: Number,
        default: 100,
    },
    signature: { type: String, default: "" },
    signature_expired_time: { type: String },
}, {
    timestamps: true,
});
users.index({ userAddress: 1 });
users.index({ username: "text" });
exports.default = mongoose_1.default.model("user", users);
