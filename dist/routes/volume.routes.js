"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const volume_controllers_1 = require("../controllers/volume.controllers");
const volumeRouter = express_1.default.Router();
volumeRouter.get("/getVolume", volume_controllers_1.getVolumeController);
exports.default = volumeRouter;
