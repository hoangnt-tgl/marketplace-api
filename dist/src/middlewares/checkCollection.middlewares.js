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
exports.checkCollectionNameExistMiddleware = exports.checkCreatorCollectionMiddleware = exports.checkCollectionCanCreateMiddleware = exports.checkCollectionCanUpdateMiddleware = exports.checkCollectionExistMiddleware = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const collection_services_1 = require("../services/collection.services");
const checkCollectionExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionId = req.body.collectionId || req.params.collectionId;
        if (collectionId) {
            const exist = yield (0, collection_services_1.checkCollectionExistsByIdService)(collectionId);
            if (exist) {
                return next();
            }
        }
        else {
            return res.status(403).json({ error: "Please provide collectionId" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(404).json({ error: "Collection not found" });
});
exports.checkCollectionExistMiddleware = checkCollectionExistMiddleware;
const checkCollectionNameExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId, collectionName } = req.body;
        if (collectionName) {
            const collectionAddress = contract_constant_1.COLLECTION_ADDRESS[chainId];
            const exist = yield (0, collection_services_1.checkCollectionExistsService)(chainId, collectionAddress, collectionName);
            if (exist) {
                return res.status(400).json({ error: "Collection name is exist" });
            }
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.checkCollectionNameExistMiddleware = checkCollectionNameExistMiddleware;
const checkCollectionCanCreateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionName = req.body.collectionName;
        const chainId = req.params.chainId || req.body.chainId;
        if (collectionName && chainId) {
            const collectionAddress = contract_constant_1.COLLECTION_ADDRESS[chainId];
            const checkName = yield (0, collection_services_1.checkCollectionExistsService)(chainId, collectionAddress, collectionName);
            if (checkName) {
                return res.status(400).json({ error: "The name is already taken" });
            }
            return next();
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Please provide collectionName and chainId" });
});
exports.checkCollectionCanCreateMiddleware = checkCollectionCanCreateMiddleware;
const checkCollectionCanUpdateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.body;
    const { collectionId } = req.params;
    const isConfirm = yield (0, collection_services_1.checkCollectionIsConfirmService)(collectionId);
    const isOwner = yield (0, collection_services_1.checkIsOwnerOfCollectionService)(collectionId, userAddress);
    if (isConfirm && isOwner) {
        return next();
    }
    return res.status(400).json({ error: "Collection not allowed to update" });
});
exports.checkCollectionCanUpdateMiddleware = checkCollectionCanUpdateMiddleware;
const checkCreatorCollectionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = req.params.creator || req.body.creator;
    const collectionId = req.params.collectionId || req.body.collectionId;
    const isCreator = yield (0, collection_services_1.checkIsOwnerOfCollectionService)(collectionId, creator);
    if (isCreator) {
        return next();
    }
    return res.status(403).json({ error: "Missing creator collection" });
});
exports.checkCreatorCollectionMiddleware = checkCreatorCollectionMiddleware;
