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
exports.getAdvertiseNFTService = exports.checkAdvertiseNFTExistService = exports.checkAdvertiseCollectionExistService = exports.getAdvertiseCollectionService = void 0;
const advertiseNFT_model_1 = __importDefault(require("../models/advertiseNFT.model"));
const advertiseCollection_model_1 = __importDefault(require("../models/advertiseCollection.model"));
const model_services_1 = require("./model.services");
const getAdvertiseCollectionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date(Date.now());
    const allAdvertise = yield advertiseCollection_model_1.default.find({ expireAt: { $gt: now } });
    return allAdvertise;
});
exports.getAdvertiseCollectionService = getAdvertiseCollectionService;
const getAdvertiseNFTService = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date(Date.now());
    const allAdvertise = yield advertiseNFT_model_1.default.find({ expireAt: { $gt: now } }).populate({ path: "itemId", select: "itemMedia itemPreviewMedia" });
    return allAdvertise;
});
exports.getAdvertiseNFTService = getAdvertiseNFTService;
const checkAdvertiseCollectionExistService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const advertise = yield (0, model_services_1.findOneService)(advertiseCollection_model_1.default, { collectionId: (0, model_services_1.createObjIdService)(collectionId) });
    return advertise ? true : false;
});
exports.checkAdvertiseCollectionExistService = checkAdvertiseCollectionExistService;
const checkAdvertiseNFTExistService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const advertise = yield (0, model_services_1.findOneService)(advertiseNFT_model_1.default, { itemId: (0, model_services_1.createObjIdService)(itemId) });
    return advertise ? true : false;
});
exports.checkAdvertiseNFTExistService = checkAdvertiseNFTExistService;
