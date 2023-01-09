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
const model_services_1 = require("../services/model.services");
const contract_constant_1 = require("../constant/contract.constant");
const collection_services_1 = require("../services/collection.services");
const response_constants_1 = require("../constant/response.constants");
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
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
});
exports.checkCollectionExistMiddleware = checkCollectionExistMiddleware;
const checkCollectionNameExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId, collectionName } = req.body;
        const { collectionId } = req.params;
        const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: (0, model_services_1.createObjIdService)(collectionId) });
        if (collectionName !== collection.collectionName) {
            if (collectionName) {
                const collectionAddress = contract_constant_1.MetaSpacecyAssetShared[chainId];
                const exist = yield (0, collection_services_1.checkCollectionExistsService)(chainId, collectionAddress, collectionName);
                if (exist) {
                    return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
                }
            }
        }
        return next();
    }
    catch (error) {
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
});
exports.checkCollectionNameExistMiddleware = checkCollectionNameExistMiddleware;
const checkCollectionCanCreateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId, royalties, logo, background, collectionName, collectionStandard, description } = req.body;
        if (!collectionStandard ||
            !collectionName ||
            royalties === undefined ||
            !logo ||
            !background ||
            !description) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        // if (!collectionName) {
        // 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
        // }
        // if (royalties === undefined) {
        // 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
        // }
        // if (!logo) {
        // 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
        // }
        // if (!background) {
        // 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
        // }
        // if (!description) {
        // 	return res.status(400).json({ error: ERROR_RESPONSE[400] });
        // }
        const collectionAddress = contract_constant_1.MetaSpacecyAssetShared[chainId];
        const checkName = yield (0, collection_services_1.checkCollectionExistsService)(chainId, collectionAddress, collectionName);
        if (checkName) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) {
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
});
exports.checkCollectionCanCreateMiddleware = checkCollectionCanCreateMiddleware;
const checkCollectionCanUpdateMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAddress = req.body.userAddress;
        const collectionId = req.params.collectionId;
        const isConfirm = yield (0, collection_services_1.checkCollectionIsConfirmService)((0, model_services_1.createObjIdService)(collectionId));
        const isOwner = yield (0, collection_services_1.checkIsOwnerOfCollectionService)(collectionId, userAddress);
        if (isConfirm && isOwner) {
            return next();
        }
        return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkCollectionCanUpdateMiddleware = checkCollectionCanUpdateMiddleware;
const checkCreatorCollectionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creator = req.params.creator || req.body.creator;
        const collectionId = req.params.collectionId || req.body.collectionId;
        const isCreator = yield (0, collection_services_1.checkIsOwnerOfCollectionService)(collectionId, creator.toLowerCase());
        if (!isCreator) {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.checkCreatorCollectionMiddleware = checkCreatorCollectionMiddleware;
