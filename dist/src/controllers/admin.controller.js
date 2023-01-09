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
exports.removeUserToBlacklistController = exports.addUserToBlacklistController = exports.setAdvertiseNFTController = exports.setAdvertiseCollectionController = exports.setConfirmCollectionCollection = void 0;
const user_services_1 = require("../services/user.services");
const user_services_2 = require("../services/user.services");
const admin_service_1 = require("../services/admin.service");
const setConfirmCollectionCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId, isConfirm } = req.body;
    try {
        if (!isConfirm) {
            return res.status(404).json({ error: "isConfirm not found" });
        }
        const collection = yield (0, admin_service_1.setConfirmCollectionService)(collectionId, isConfirm);
        return res.status(200).json(collection);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot set confirm" });
});
exports.setConfirmCollectionCollection = setConfirmCollectionCollection;
const setAdvertiseCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId, mainImage, secondaryImage, title, expireAt } = req.body;
    try {
        const collection = yield (0, admin_service_1.setAdvertiseCollectionService)(collectionId, mainImage, secondaryImage, title, expireAt);
        return res.status(200).json(collection);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot set advertise of collection" });
});
exports.setAdvertiseCollectionController = setAdvertiseCollectionController;
const setAdvertiseNFTController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, expireAt } = req.body;
    try {
        const nft = yield (0, admin_service_1.setAdvertiseNFTService)(itemId, expireAt);
        return res.status(200).json(nft);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot set advertise of NFT" });
});
exports.setAdvertiseNFTController = setAdvertiseNFTController;
const addUserToBlacklistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.body;
    if (!userAddress) {
        return res.status(400).json("Missing userAddress");
    }
    try {
        const user = yield (0, user_services_2.addUserToBlacklistService)(userAddress);
        if (user) {
            return res.status(200).json(`${userAddress} has been added to blacklist`);
        }
    }
    catch (error) { }
    return res.status(500).json("Can't add to blacklist");
});
exports.addUserToBlacklistController = addUserToBlacklistController;
const removeUserToBlacklistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.body;
    if (!userAddress) {
        return res.status(400).json("Missing userAddress");
    }
    try {
        const user = yield (0, user_services_1.removeUserFromBlacklistService)(userAddress);
        if (user) {
            return res.status(200).json(`${userAddress} has been deleted from blacklist`);
        }
    }
    catch (error) { }
    return res.status(500).json("Can't delete from blacklist");
});
exports.removeUserToBlacklistController = removeUserToBlacklistController;
