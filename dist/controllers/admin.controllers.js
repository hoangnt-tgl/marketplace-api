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
exports.importNFTForINOController = exports.initCollectionController = exports.initBoxController = exports.addUserToBlacklistController = exports.getItemsByCollectionIdController = exports.setAdvertiseNFTController = exports.setAdvertiseCollectionController = exports.removeUserToBlacklistController = exports.getAllUserController = exports.getAllCollectionsController = exports.uploadAdminController = exports.setConfirmCollectionController = void 0;
const user_services_1 = require("../services/user.services");
const user_services_2 = require("../services/user.services");
const admin_service_1 = require("../services/admin.service");
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
const collection_services_1 = require("../services/collection.services");
const item_services_1 = require("../services/item.services");
const response_constants_1 = require("../constant/response.constants");
const setConfirmCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId, isConfirm } = req.body;
    try {
        if (isConfirm === undefined || isConfirm === null) {
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        }
        const collection = yield (0, admin_service_1.setConfirmCollectionService)(collectionId, isConfirm);
        return res.status(200).json(collection);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.setConfirmCollectionController = setConfirmCollectionController;
const setAdvertiseCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId, mainImage, secondaryImage, title, expireAt } = req.body;
    try {
        const collection = yield (0, admin_service_1.setAdvertiseCollectionService)(collectionId, mainImage, secondaryImage, title, expireAt);
        return res.status(200).json(collection);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.setAdvertiseCollectionController = setAdvertiseCollectionController;
const setAdvertiseNFTController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, expireAt } = req.body;
    try {
        const nft = yield (0, admin_service_1.setAdvertiseNFTService)(itemId, expireAt);
        return res.status(200).json(nft);
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot set advertise of NFT" });
    }
});
exports.setAdvertiseNFTController = setAdvertiseNFTController;
const addUserToBlacklistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json("Missing userAddress");
    }
    try {
        const user = yield (0, user_services_2.addUserToBlacklistService)(address);
        if (user) {
            return res.status(200).json({ msg: `${address} has been added to blacklist` });
        }
    }
    catch (error) { }
    return res.status(500).json(response_constants_1.ERROR_RESPONSE[500]);
});
exports.addUserToBlacklistController = addUserToBlacklistController;
const removeUserToBlacklistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    if (!address) {
        return res.status(404).json(response_constants_1.ERROR_RESPONSE[404]);
    }
    try {
        const user = yield (0, user_services_1.removeUserFromBlacklistService)(address);
        if (user) {
            return res.status(200).json(`${address} has been deleted from blacklist`);
        }
    }
    catch (error) { }
    return res.status(500).json(response_constants_1.ERROR_RESPONSE[500]);
});
exports.removeUserToBlacklistController = removeUserToBlacklistController;
const getAllUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_services_1.getAllUsersService)();
        res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getAllUserController = getAllUserController;
const getAllCollectionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield (0, collection_services_1.getAllCollectionsService)();
        res.status(200).json(collections);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getAllCollectionsController = getAllCollectionsController;
const getItemsByCollectionIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId } = req.params;
    try {
        const items = yield (0, item_services_1.getItemsByCollectionService)(collectionId);
        res.status(200).json(items);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemsByCollectionIdController = getItemsByCollectionIdController;
const uploadAdminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)();
        const result = yield (0, uploadFile_service_1.handleAdminUpload)(form, req, "admin");
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.uploadAdminController = uploadAdminController;
const initBoxController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.body.chainId;
    try {
        yield (0, admin_service_1.initBoxService)(chainId);
        return res.status(200).json({ success: "Init success" });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.initBoxController = initBoxController;
const initCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.body.chainId;
    try {
        yield (0, admin_service_1.initCollectionService)(chainId);
        return res.status(200).json({ success: "Init success" });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.initCollectionController = initCollectionController;
const importNFTForINOController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId, userAddress, collectionAddress, listTokenId } = req.body;
        const asset = yield (0, admin_service_1.getAssetINOService)(chainId, userAddress, collectionAddress, listTokenId);
        console.log(asset);
        return res.status(200).json(asset);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.importNFTForINOController = importNFTForINOController;
