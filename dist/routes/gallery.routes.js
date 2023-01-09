"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gallery_controllers_1 = require("../controllers/gallery.controllers");
const gallery_controllers_2 = require("../controllers/gallery.controllers");
const galleryRouter = express_1.default.Router();
galleryRouter.post("/add", gallery_controllers_2.addTemplateController);
galleryRouter.post("/load", gallery_controllers_1.loadGalleryController);
galleryRouter.post("/set", gallery_controllers_1.setPositionController);
exports.default = galleryRouter;
