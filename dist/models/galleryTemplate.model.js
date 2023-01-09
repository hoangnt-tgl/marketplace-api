"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const galleryTemplate = new mongoose_1.default.Schema({
    url: { type: String, required: true },
    camera: { type: Array, required: true },
    light: { type: Array, required: true },
    positions: { type: Array, default: [] },
}, { timestamps: true });
exports.default = mongoose_1.default.model("galleryTemplate", galleryTemplate);
