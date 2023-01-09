"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositionController = exports.loadGalleryController = exports.addTemplateController = void 0;
const response_constants_1 = require("../constant/response.constants");
const gallery_service_1 = require("../services/gallery.service");
const addTemplateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, positions } = req.body;
        const template = yield (0, gallery_service_1.addTemplateService)(url, positions);
        return res.status(200).json({ data: template });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.addTemplateController = addTemplateController;
const loadGalleryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId, userAddress } = req.body;
        const data = yield (0, gallery_service_1.loadGalleryService)(userAddress, templateId);
        return res.status(200).json({ data });
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.loadGalleryController = loadGalleryController;
const setPositionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId, userAddress, itemId, positionName } = req.body;
        const position = yield (0, gallery_service_1.setPositionService)(templateId, positionName, userAddress, itemId);
        return res.status(200).json({ data: position });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.setPositionController = setPositionController;
