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
exports.uploadCollectionImageController = exports.getCategoryController = exports.getCollectionCategoryController = exports.getCollectionByOwnerItemController = exports.getCollectionDetailController = exports.queryCollectionIdsInPageController = exports.isCollectionNameExistController = exports.getTopCollectionController = exports.getCollectionByIdController = exports.updateCollectionController = exports.createCollectionController = exports.getCollectionInfoController = void 0;
const model_services_1 = require("../services/model.services");
const contract_constant_1 = require("../constant/contract.constant");
const collection_services_1 = require("../services/collection.services");
const collection_constant_1 = require("../constant/collection.constant");
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
// POST Methods
const createCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, chainId, royalties, logo, background, collectionName, collectionStandard, description, category, } = req.body;
    if (royalties === undefined || !logo || !background || !collectionName || !collectionStandard) {
        return res.status(400).json({ error: "Missing information" });
    }
    try {
        const collection = yield (0, collection_services_1.createCollectionIfNotExistService)(userAddress, logo, background, collectionName, parseInt(chainId), collectionStandard, description, royalties, category);
        if (collection) {
            return res.status(200).json(collection);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(400).json({ error: "Collection is exist" });
});
exports.createCollectionController = createCollectionController;
const uploadCollectionImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promise = () => {
            return new Promise((resolve, rejects) => {
                const form = (0, formidable_1.default)();
                let fileURL;
                form.parse(req, (error, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        rejects(error);
                    }
                    else {
                        const msg = (0, uploadFile_service_1.checkUploadService)(files.file, true);
                        if (msg) {
                            rejects(msg);
                        }
                        else {
                            fileURL = yield (0, uploadFile_service_1.uploadImageToStorageService)("collections", Date.now().toString(), files.file.filepath);
                            resolve(fileURL);
                        }
                    }
                }));
            });
        };
        const result = yield promise();
        return res.status(200).json(result);
    }
    catch (error) { }
    return res.status(500).json({ error: "Failed to upload" });
});
exports.uploadCollectionImageController = uploadCollectionImageController;
const getCollectionInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionId = req.params.collectionId;
        const collection = (0, collection_services_1.getOneCollectionService)({ _id: (0, model_services_1.createObjIdService)(collectionId) });
        return res.status(200).json(collection);
    }
    catch (error) { }
    return res.status(500).json({ error: "Can't get collection" });
});
exports.getCollectionInfoController = getCollectionInfoController;
const isCollectionNameExistController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionName = req.body.collectionName;
    const chainId = req.body.chainId;
    if (!collectionName) {
        return res.status(400).json({ error: "Missing collection name" });
    }
    const collectionAddress = contract_constant_1.COLLECTION_ADDRESS[chainId];
    const checkName = yield (0, collection_services_1.checkCollectionExistsService)(chainId, collectionName, collectionAddress);
    return res.status(200).json(checkName);
});
exports.isCollectionNameExistController = isCollectionNameExistController;
// UPDATE Methods
const updateCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId } = req.params;
    const { logo, background, description, collectionName, category } = req.body;
    try {
        const collection = yield (0, collection_services_1.updateCollectionService)(collectionId, logo, background, description, collectionName, category);
        if (collection) {
            res.status(200).json(collection);
        }
        else
            res.status(400).json({ message: "Failed to update collection" });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
});
exports.updateCollectionController = updateCollectionController;
const queryCollectionIdsInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { chainId, userAddress, collectionName, collectionStandard, sort, category } = req.body;
    try {
        const collections = yield (0, collection_services_1.queryCollectionIdsInPageService)(parseInt(pageSize), parseInt(pageId), chainId, userAddress, collectionName, collectionStandard, sort, category);
        return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.queryCollectionIdsInPageController = queryCollectionIdsInPageController;
const getCollectionByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId } = req.params;
    try {
        const collection = yield (0, collection_services_1.getCollectionByIdService)(collectionId);
        return res.status(200).json(collection);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
exports.getCollectionByIdController = getCollectionByIdController;
const getCollectionDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId } = req.params;
    try {
        const collection = yield (0, collection_services_1.getCollectionDetailService)(collectionId);
        return res.status(200).json(collection);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
exports.getCollectionDetailController = getCollectionDetailController;
const getTopCollectionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageSize, pageId } = req.params;
        const { sortBy, sortFrom, objectQuery } = req.body;
        const collections = yield (0, collection_services_1.getTopCollectionService)(sortBy, sortFrom, objectQuery, Number(pageSize), Number(pageId));
        return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
exports.getTopCollectionController = getTopCollectionController;
const getCollectionByOwnerItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.params;
        const collections = yield (0, collection_services_1.getCollectionsByOwnerItemsService)(userAddress);
        return res.status(200).json(collections);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
exports.getCollectionByOwnerItemController = getCollectionByOwnerItemController;
const getCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json(collection_constant_1.CATEGORY);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot get category" });
});
exports.getCategoryController = getCategoryController;
const getCollectionCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield (0, collection_services_1.getCategoryCollectionService)();
        return res.status(200).json(category);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Cannot get categories" });
});
exports.getCollectionCategoryController = getCollectionCategoryController;
