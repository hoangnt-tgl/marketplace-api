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
exports.getItemIdInPageController1 = exports.getListItemsHaveOfferingController = exports.getStaticItemController = exports.getItemByChainIdController = exports.getBoxController = exports.getAssetBoxController = exports.getBoxAssetController = exports.importItemController = exports.getSearchItemByIdController = exports.getSearchItemIdInPageController = exports.uploadItemPreviewMediaController = exports.uploadItemMediaController = exports.getItemIdInPageController = exports.getItemByIdController = exports.getListItemsSellingController = exports.changePriceBetweenPairCoinController = exports.deletePropertiesController = exports.updatePropertiesController = exports.freezeItemController = exports.getMetadataController = exports.updateItemController = exports.getItemDetailController = exports.createItemDropController = exports.createItemController = void 0;
const history_services_1 = require("../services/history.services");
const item_services_1 = require("../services/item.services");
const other_services_1 = require("../services/other.services");
const default_constant_1 = require("../constant/default.constant");
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
const collection_services_1 = require("../services/collection.services");
const model_services_1 = require("../services/model.services");
const response_constants_1 = require("../constant/response.constants");
const item_model_1 = __importDefault(require("../models/item.model"));
const Order_model_1 = __importDefault(require("../models/Order.model"));
const createItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, userAddress, creator, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, properties, price, priceType, external_url, metadata, chainId, quantity, } = req.body;
        const itemTokenId = (0, other_services_1.createTokenIdService)(userAddress, quantity);
        const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: (0, model_services_1.createObjIdService)(collectionId) });
        //Create on database
        const item = yield (0, item_services_1.createItemService)(itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, userAddress, creator, collectionId, collection.collectionStandard, Number(chainId), properties, price, priceType, external_url, metadata);
        yield (0, history_services_1.createHistoryService)(collectionId, item._id, default_constant_1.NULL_ADDRESS, userAddress, "0", "eth", quantity, "", 1);
        const response = {
            data: item,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
    }
});
exports.createItemController = createItemController;
const createItemDropController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    // 	const {
    // 		collectionId,
    // 		userAddress,
    // 		creator,
    // 		itemName,
    // 		description,
    // 		itemMedia,
    // 		itemOriginMedia,
    // 		itemPreviewMedia,
    // 		properties,
    // 		price,
    // 		priceType,
    // 		external_url,
    // 		metadata,
    // 		chainId,
    // 		quantity,
    // 		itemTokenId,
    // 		txHash
    // 	} = req.body;
    // 	const collection: Collection = await getOneCollectionService({ _id: createObjIdService(collectionId) });
    // 	//Create on database
    // 	const item: Item = await createItemService(
    // 		itemTokenId,
    // 		itemName,
    // 		description,
    // 		itemMedia,
    // 		itemOriginMedia,
    // 		itemPreviewMedia,
    // 		userAddress,
    // 		creator,
    // 		collectionId,
    // 		collection.collectionStandard,
    // 		Number(chainId),
    // 		properties,
    // 		price,
    // 		priceType,
    // 		external_url,
    // 		metadata,
    // 	);
    // 	await createHistoryService(collectionId, item._id, NULL_ADDRESS, userAddress, price, priceType, quantity, txHash, 1);
    // 	const response: ResponseAPI<Item> = {
    // 		data: item,
    // 	};
    // 	return res.status(200).json(response);
    // } catch (error: any) {
    // 	return res.status(403).json({ error: ERROR_RESPONSE[403] });
    // }
    try {
        const { collectionId } = req.body || req.params || req.query;
        const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: (0, model_services_1.createObjIdService)(collectionId) });
        const collectionInfo = yield (0, collection_services_1.getCollectionIdInfoService)(collectionId);
        if (collection.collectionStandard === "ERC1155") {
            const { collectionId, availableItem, productId, userAddress, itemTokenId, } = req.body;
            const update = yield (0, collection_services_1.updateTotalItem)(collectionId, availableItem, productId, userAddress, itemTokenId);
            return res.status(200).json(update);
        }
        else if (collection.collectionStandard === "ERC721") {
            const { userAddress, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, price, priceType, chainId, itemTokenId, } = req.body;
            const txHash = "";
            const item1 = yield (0, item_services_1.createItemService1)(itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, userAddress, collection._id.toString(), collection.collectionStandard, Number(chainId), price, priceType);
            let owner = 0;
            const check = yield (0, item_services_1.updateOwnerItem1155)(itemTokenId, collectionId, userAddress);
            if (check === true) {
                owner = Number(collectionInfo.owner) + 1;
            }
            else if (check === false) {
                owner = Number(collectionInfo.owner);
            }
            const productId = Number(collectionInfo.item.length) + 1;
            const totalItem = 1, availableItem = 1;
            const item = collectionInfo.item;
            const item2 = {
                productId,
                itemTokenId,
                itemName,
                itemMedia,
                totalItem,
                availableItem,
            };
            item[Number(collectionInfo.item.length)] = item2;
            const totalNFT = collectionInfo.totalNFT;
            const availableNFT = Number(collectionInfo.availableNFT) - 1;
            const totalSales = Math.round(Number(collectionInfo.totalSales) + Number(collectionInfo.price) * 10 * 1 * 10 / 100);
            yield (0, collection_services_1.updateCollectionInfo)({ collectionId }, { totalNFT, totalSales, owner, availableNFT, item });
            yield (0, history_services_1.createHistoryService)(collection._id, item1._id, default_constant_1.NULL_ADDRESS, collection.userAddress, price.toString(), priceType, 1, txHash, 1);
            const response = {
                data: item1,
            };
            return res.status(200).json(response);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createItemDropController = createItemDropController;
const getItemByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.itemId;
    const userAddress = req.query.userAddress;
    try {
        const item = yield (0, item_services_1.getItemDetailService)(itemId, userAddress, false);
        const response = {
            data: item,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemByIdController = getItemByIdController;
const getSearchItemByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    try {
        const item = yield (0, item_services_1.getSearchItemByIdService)(itemId);
        const response = {
            data: item,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getSearchItemByIdController = getSearchItemByIdController;
const getItemDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userAddress = req.query.userAddress;
    try {
        const item = yield (0, item_services_1.getItemDetailService)(itemId, userAddress);
        const response = {
            data: item,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemDetailController = getItemDetailController;
const getItemIdInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.params.pageSize;
    const pageId = req.params.pageId;
    const { chainId, itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, offer_status, sort, } = req.body;
    try {
        const listItem = yield (0, item_services_1.getItemIdInPageService)(itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, sort, chainId, offer_status, parseInt(pageSize), parseInt(pageId));
        res.status(200).json(listItem);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemIdInPageController = getItemIdInPageController;
const getItemIdInPageController1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.params.pageSize;
    const pageId = req.params.pageId;
    const { chainId, itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, offer_status, sort, isINO, } = req.body;
    try {
        const listItem = yield (0, item_services_1.getItemIdInPageService1)(itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, sort, chainId, offer_status, isINO, parseInt(pageSize), parseInt(pageId));
        res.status(200).json(listItem);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemIdInPageController1 = getItemIdInPageController1;
const getAssetBoxController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId } = req.body;
    try {
        const listAssetBox = yield (0, item_services_1.getAsset1155)(chainId);
        return res.status(200).json({ data: listAssetBox });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getAssetBoxController = getAssetBoxController;
const getSearchItemIdInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.params.pageSize;
    const pageId = req.params.pageId;
    const text = req.body.text;
    const sort = req.body.sort;
    try {
        const listItem = yield (0, item_services_1.getSearchItemIdInPageService)(text, parseInt(pageSize), parseInt(pageId), sort);
        res.status(200).json(listItem);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getSearchItemIdInPageController = getSearchItemIdInPageController;
const updateItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const { itemName, itemMedia, itemOriginMedia, itemPreviewMedia, description } = req.body;
    try {
        const item = yield (0, item_services_1.updateItemService)(itemId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia);
        const response = {
            data: item,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.updateItemController = updateItemController;
const getMetadataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    try {
        const item = yield (0, item_services_1.getMetadataService)(itemId);
        const response = {
            data: item,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getMetadataController = getMetadataController;
const freezeItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, metadata } = req.body;
    try {
        console.log("body: ", req.body);
        const item = yield (0, item_services_1.freezeItemService)(itemId, metadata);
        if (item) {
            const response = {
                data: item,
            };
            return res.status(200).json(response);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.freezeItemController = freezeItemController;
const updatePropertiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const properties = req.body.properties;
    try {
        yield (0, item_services_1.updatePropertiesService)(itemId, properties);
        const response = {
            data: "Update properties success",
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.updatePropertiesController = updatePropertiesController;
const deletePropertiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const properties = req.body.properties;
    try {
        yield (0, item_services_1.deletePropertiesService)(itemId, properties);
        const response = {
            data: "Delete properties success",
        };
        return res.status(200).json(response);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.deletePropertiesController = deletePropertiesController;
const changePriceBetweenPairCoinController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, inputPrice } = req.body;
        const transferPriceOutput = yield (0, item_services_1.changePriceService)(from, to, inputPrice);
        if (!transferPriceOutput) {
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        }
        return res.status(200).json({ data: transferPriceOutput });
    }
    catch (error) {
        res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.changePriceBetweenPairCoinController = changePriceBetweenPairCoinController;
const uploadItemMediaController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                        const msg = (0, uploadFile_service_1.checkUploadService)(files.file);
                        if (msg) {
                            rejects(msg);
                        }
                        else {
                            try {
                                const ipfs = yield (0, uploadFile_service_1.uploadFileToIpfsService)(files.file.filepath);
                                const extend = files.file.mimetype.split("/");
                                if (extend[1] === "gif" || extend[1] === "webp") {
                                    fileURL = yield (0, uploadFile_service_1.uploadFileToStorageService)("nft", ipfs.cid, files.file.filepath, true);
                                }
                                else if (extend[0] === "image") {
                                    fileURL = yield (0, uploadFile_service_1.uploadImageToStorageService)("nft", ipfs.cid, files.file.filepath);
                                }
                                else {
                                    fileURL = yield (0, uploadFile_service_1.uploadFileToStorageService)("nft", ipfs.cid, files.file.filepath);
                                }
                                resolve({
                                    itemMedia: fileURL,
                                    itemOriginMedia: ipfs.url,
                                });
                            }
                            catch (error) {
                                return res.status(500).send({ error: response_constants_1.ERROR_RESPONSE[500] });
                            }
                        }
                    }
                }));
            });
        };
        const result = yield promise();
        return res.status(200).json({ data: result });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.uploadItemMediaController = uploadItemMediaController;
const uploadItemPreviewMediaController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)();
        const result = yield (0, uploadFile_service_1.handlePromiseUpload)(form, req, "nft");
        return res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.uploadItemPreviewMediaController = uploadItemPreviewMediaController;
const importItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, collectionAddress, userAddress, listTokenId } = req.body;
    if (!listTokenId || listTokenId.length === 0) {
        return res.status(400).json("List token id is empty");
    }
    try {
        const alchemyURI = process.env.ALCHEMY_API_SERVER || "";
        const result = yield (0, other_services_1.postDataToURL)(`${alchemyURI}/alchemy/importNFT`, {
            chainId,
            userAddress,
            collectionAddress,
            listTokenId,
        });
        return res.status(result.status).json({ data: result.result });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.importItemController = importItemController;
const getListItemsSellingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId } = req.body;
        const listItems = yield (0, item_services_1.getListItemsSellingService)(chainId);
        if (!listItems) {
            return res.status(400).json({ error: "Failed to get list items" });
        }
        return res.status(200).json({ data: listItems });
    }
    catch (error) {
        res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListItemsSellingController = getListItemsSellingController;
const getBoxController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId } = req.body;
    try {
        const boxes = yield (0, item_services_1.getBoxService)(chainId);
        return res.status(200).json({ data: boxes });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getBoxController = getBoxController;
const getItemByChainIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, userAddress } = req.query;
    try {
        const items = yield (0, item_services_1.getManyItemService)({ owner: userAddress === null || userAddress === void 0 ? void 0 : userAddress.toString().toLowerCase(), chainId });
        return res.status(200).json({ data: items });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getItemByChainIdController = getItemByChainIdController;
const getStaticItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            data: [
                { _id: "63281ada6ea7800babfc35ad" },
                { _id: "6321b0f7cfd336026ed8c28f" },
                { _id: "63281b5c6ea7800babfc3676" },
                { _id: "63281cbc6ea7800babfc384a" },
                { _id: "63281d0f6ea7800babfc38b5" },
                { _id: "63281c656ea7800babfc37f2" },
                { _id: "63281f1f6ea7800babfc3abf" },
                { _id: "63281ddd6ea7800babfc3985" },
                { _id: "63281e9d6ea7800babfc3a50" },
                { _id: "632822ff6ea7800babfc3db6" },
                { _id: "632820276ea7800babfc3bfe" },
                { _id: "632820e96ea7800babfc3cb7" },
            ],
            pagination: {
                currentPage: 1,
                pageSize: 12,
                totalPages: 1,
                totalItem: 12,
            },
        });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getStaticItemController = getStaticItemController;
//Box
const getBoxAssetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageId, pageSize } = req.params;
    const { chainId, type } = req.body;
    try {
        const boxes = yield (0, item_services_1.getBoxAssetService)(chainId, Number(pageId), Number(pageSize), type);
        return res.status(200).json(boxes);
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getBoxAssetController = getBoxAssetController;
const getListItemsHaveOfferingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.body.chainId;
    const userAddress = req.body.taker;
    try {
        const listItemByOwner = yield item_model_1.default.find({ owner: { $in: userAddress }, chainId: chainId });
        const getlistOrderBymaker = yield Order_model_1.default.find({ maker: { $ne: default_constant_1.NULL_ADDRESS }, taker: default_constant_1.NULL_ADDRESS, type: 1, chainId: chainId });
        const result = new Array();
        Promise.all(yield listItemByOwner.map((a) => __awaiter(void 0, void 0, void 0, function* () {
            getlistOrderBymaker.map(b => {
                if (a._id.toString() === b.itemId.toString()) {
                    result.push(b);
                }
            });
        }))).then(() => {
            return res.status(200).json({ data: result });
        }).catch(() => {
            return res.status(200).json({ mes: "fail" });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListItemsHaveOfferingController = getListItemsHaveOfferingController;
