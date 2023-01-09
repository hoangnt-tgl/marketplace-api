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
exports.setAdvertiseNFTService = exports.setAdvertiseCollectionService = exports.setConfirmCollectionService = void 0;
const advertiseNFT_model_1 = __importDefault(require("../models/advertiseNFT.model"));
const advertiseCollection_model_1 = __importDefault(require("../models/advertiseCollection.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const advertise_service_1 = require("./advertise.service");
const model_services_1 = require("./model.services");
const setConfirmCollectionService = (collectionId, isConfirm) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, model_services_1.updateOneService)(collection_model_1.default, { _id: (0, model_services_1.createObjIdService)(collectionId) }, { isConfirm });
    return collection;
});
exports.setConfirmCollectionService = setConfirmCollectionService;
const setAdvertiseCollectionService = (collectionId, mainImage, secondaryImage, title, expireAt) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield (0, advertise_service_1.checkAdvertiseCollectionExistService)(collectionId);
    let collection;
    if (expireAt) {
        expireAt = new Date(Number(expireAt));
    }
    if (check) {
        collection = yield (0, model_services_1.updateOneService)(advertiseCollection_model_1.default, { collectionId: (0, model_services_1.createObjIdService)(collectionId) }, { mainImage, secondaryImage, title, expireAt });
    }
    else {
        collection = yield (0, model_services_1.createService)(advertiseCollection_model_1.default, {
            collectionId: (0, model_services_1.createObjIdService)(collectionId),
            mainImage,
            secondaryImage,
            expireAt,
        });
    }
    return collection;
});
exports.setAdvertiseCollectionService = setAdvertiseCollectionService;
const setAdvertiseNFTService = (itemId, expireAt) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield (0, advertise_service_1.checkAdvertiseNFTExistService)(itemId);
    let nft;
    if (expireAt) {
        expireAt = new Date(Number(expireAt));
    }
    if (check) {
        nft = yield (0, model_services_1.updateOneService)(advertiseNFT_model_1.default, { itemId: (0, model_services_1.createObjIdService)(itemId) }, { expireAt });
    }
    else {
        nft = yield (0, model_services_1.createService)(advertiseNFT_model_1.default, {
            itemId: (0, model_services_1.createObjIdService)(itemId),
            expireAt,
        });
    }
    return nft;
});
exports.setAdvertiseNFTService = setAdvertiseNFTService;
