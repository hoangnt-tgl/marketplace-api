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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositionService = exports.addTemplateService = exports.loadGalleryService = void 0;
const galleryTemplate_model_1 = __importDefault(require("../models/galleryTemplate.model"));
const model_services_1 = require("./model.services");
const userAsset_model_1 = __importDefault(require("../models/userAsset.model"));
const addTemplateService = (url, positions) => __awaiter(void 0, void 0, void 0, function* () {
    const template = yield (0, model_services_1.createService)(galleryTemplate_model_1.default, { url, positions });
    return template;
});
exports.addTemplateService = addTemplateService;
const loadGalleryService = (userAddress, templateId) => __awaiter(void 0, void 0, void 0, function* () {
    const template = yield (0, model_services_1.findOneService)(galleryTemplate_model_1.default, { _id: (0, model_services_1.createObjIdService)(templateId) });
    const data = {
        url: template.url,
        positions: [],
    };
    const assets = yield userAsset_model_1.default
        .find({ templateId: template._id, userAddress })
        .populate({ path: "itemInfo", select: "itemMedia" });
    template.positions.map((position) => {
        const asset = assets.find(a => a.positionName === position);
        data.positions.push({
            name: position,
            media: asset ? asset.itemInfo.itemMedia : "",
        });
    });
    return data;
});
exports.loadGalleryService = loadGalleryService;
const setPositionService = (templateId, positionName, userAddress, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const position = yield userAsset_model_1.default.findOneAndUpdate({
        templateId: (0, model_services_1.createObjIdService)(templateId),
        positionName,
        userAddress,
    }, {
        itemId: (0, model_services_1.createObjIdService)(itemId),
    }, {
        new: true,
        upsert: true,
    });
    return position;
});
exports.setPositionService = setPositionService;
