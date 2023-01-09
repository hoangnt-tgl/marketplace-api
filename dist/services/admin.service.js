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
exports.getAssetINOService = exports.initCollectionService = exports.initBoxService = exports.setAdvertiseNFTService = exports.setAdvertiseCollectionService = exports.setConfirmCollectionService = void 0;
const advertiseNFT_model_1 = __importDefault(require("../models/advertiseNFT.model"));
const advertiseCollection_model_1 = __importDefault(require("../models/advertiseCollection.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const advertise_service_1 = require("./advertise.service");
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const collection_services_1 = require("./collection.services");
const item_services_1 = require("./item.services");
const item_model_1 = __importDefault(require("../models/item.model"));
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
const initBoxService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, other_services_1.multiProcessService)([
            (0, collection_services_1.getCollectionBoxERC1155Service)(chainId),
            (0, collection_services_1.getCollectionAssetERC1155Service)(chainId),
            (0, collection_services_1.getCollectionCardService)(chainId),
        ]);
        yield (0, item_services_1.getBox1155)(chainId);
        yield (0, item_services_1.getItem1155)(chainId);
        console.log("done");
    }
    catch (error) {
        console.log(error);
    }
});
exports.initBoxService = initBoxService;
const initCollectionService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, other_services_1.multiProcessService)([
            (0, collection_services_1.getBoarcDropCollectionService)(chainId)
        ]);
        console.log("done");
    }
    catch (error) {
        console.log(error);
    }
});
exports.initCollectionService = initCollectionService;
const getAssetINOService = (chainId, userAddress, collectionAddress, listTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const alchemyURI = process.env.ALCHEMY_API_SERVER || "";
    yield (0, other_services_1.postDataToURL)(`${alchemyURI}/alchemy/importNFT`, {
        chainId,
        userAddress,
        collectionAddress,
        listTokenId,
    });
    const collection = yield collection_model_1.default.findOneAndUpdate({
        chainId,
        collectionAddress: collectionAddress.toLowerCase(),
    }, { isConfirm: true, isINO: true }, { new: true });
    yield item_model_1.default.updateMany({ owner: userAddress.toLowerCase(), itemTokenId: listTokenId, collectionId: collection._id }, { isINO: true });
    const listItem = yield (0, item_services_1.getManyItemService)({
        owner: userAddress.toLowerCase(),
        itemTokenId: listTokenId,
        collectionId: collection._id,
    });
    return { listItem, collection };
});
exports.getAssetINOService = getAssetINOService;
