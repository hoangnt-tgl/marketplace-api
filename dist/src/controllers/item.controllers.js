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
exports.uploadItemPreviewMediaController = exports.uploadItemMediaController = exports.getItemDetailInAuctionController = exports.getItemByIdInAuctionController = exports.getItemIdInPageController = exports.getItemByIdController = exports.getItemAuctionController = exports.getItemByCollectionAndTokenIdController = exports.getListItemsSellingController = exports.changePriceBetweenPairCoinController = exports.updateAttributesController = exports.deletePropertiesController = exports.updatePropertiesController = exports.freezeItemController = exports.updateItemController = exports.getItemDetailController = exports.createItemController = void 0;
const history_services_1 = require("../services/history.services");
const item_services_1 = require("../services/item.services");
const other_services_1 = require("../services/other.services");
const user_services_1 = require("../services/user.services");
const default_constant_1 = require("../constant/default.constant");
const formidable_1 = __importDefault(require("formidable"));
const uploadFile_service_1 = require("../services/uploadFile.service");
const createItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, userAddress, creator, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, itemStandard, attributes, properties, price, priceType, chainId, } = req.body;
        console.log(res.locals.ipfsImage);
        const itemTokenId = yield (0, other_services_1.createTokenIdService)(userAddress); // TokenId is itemId
        //Create on database
        const item = yield (0, item_services_1.createItemService)(itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, userAddress, creator, collectionId, itemStandard, parseInt(chainId), attributes, properties, price, priceType, "", "", userAddress);
        yield (0, user_services_1.updateNonceService)(userAddress);
        const history = yield (0, history_services_1.createHistoryService)(collectionId, item.id, default_constant_1.NULL_ADDRESS, userAddress, "0", "eth", "", 1);
        if (item && history) {
            return res.status(201).json(item);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(403).json({ error: "Can't create item" });
});
exports.createItemController = createItemController;
const getItemByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userAddress = req.query.userAddress;
    try {
        const item = yield (0, item_services_1.getItemByIdService)(itemId, userAddress);
        return res.status(200).json(item);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Cannot get item" });
});
exports.getItemByIdController = getItemByIdController;
const getItemDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userAddress = req.query.userAddress;
    try {
        const item = yield (0, item_services_1.getItemDetailService)(itemId, userAddress);
        if (item) {
            return res.status(200).json(item);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(404).json({ error: "Item not found" });
});
exports.getItemDetailController = getItemDetailController;
const getItemIdInPageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = req.params.pageSize;
    const pageId = req.params.pageId;
    const chainId = req.body.chainId;
    const itemName = req.body.itemName;
    const owner = req.body.owner;
    const creator = req.body.creator;
    const collectionId = req.body.collectionId;
    const itemStandard = req.body.itemStandard;
    const status = req.body.status;
    const paymentToken = req.body.paymentToken;
    const tokenSymbol = req.body.tokenSymbol;
    const minPrice = req.body.minPrice;
    const maxPrice = req.body.maxPrice;
    const offer_status = req.body.offer_status;
    const sort = req.body.sort;
    try {
        const listItem = yield (0, item_services_1.getItemIdInPageService)(itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, sort, chainId, offer_status, parseInt(pageSize), parseInt(pageId));
        return res.status(200).json(listItem);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getItemIdInPageController = getItemIdInPageController;
const updateItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, userAddress } = req.params;
    const { itemName, itemMedia, itemOriginMedia, itemPreviewMedia, description } = req.body;
    try {
        const item = yield (0, item_services_1.updateItemService)(itemId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, userAddress);
        return res.status(200).json(item);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(403).json({ error: "Can't update item" });
});
exports.updateItemController = updateItemController;
const freezeItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const metaData = req.body.metaData;
    try {
        const item = yield (0, item_services_1.freezeItemService)(itemId, metaData);
        return res.status(200).json(item);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(403).json({ error: "Can't freeze item" });
});
exports.freezeItemController = freezeItemController;
const updatePropertiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const properties = req.body.properties;
    try {
        yield (0, item_services_1.updatePropertiesService)(itemId, properties);
        return res.status(200).json("Update properties success");
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(403).json({ error: "Can't update properties" });
});
exports.updatePropertiesController = updatePropertiesController;
const deletePropertiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const properties = req.body.properties;
    try {
        yield (0, item_services_1.deletePropertiesService)(itemId, properties);
        return res.status(200).json("Delete properties success");
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(403).json({ error: "Can't delete properties" });
});
exports.deletePropertiesController = deletePropertiesController;
const updateAttributesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const attributes = req.body.attributes;
    try {
        yield (0, item_services_1.updateAttributesService)(itemId, attributes);
        return res.status(200).json("Update attributes success");
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(403).json({ error: "Can't update attributes" });
});
exports.updateAttributesController = updateAttributesController;
/**
 * @author [dev-huy]
 * @create date 2022-02-18 10:35:43
 * @modify date 2022-02-18 10:35:43
 * @desc [Change Price Between Pair Coin With Same ChainId]
 */
const changePriceBetweenPairCoinController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, inputPrice } = req.body;
        const transferPriceOutput = yield (0, item_services_1.changePriceService)(from, to, inputPrice);
        if (!transferPriceOutput) {
            return res.status(400).json({ message: "Failed to transfer price" });
        }
        return res.status(200).json({ data: transferPriceOutput });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.changePriceBetweenPairCoinController = changePriceBetweenPairCoinController;
/**
 * @author [dev-huy]
 * @create date 2022-02-18 10:35:43
 * @modify date 2022-02-18 10:35:43
 * @desc [Get Top 10 Highest Price Item]
 */
// const getTop10HighestPriceItemController = async (req: Request, res: Response) => {
// 	try {
// 		const { category } = req.params;
// 		if (!category) return res.status(400).json({ message: "Missing category" });
// 		const listItems = await getTop10HighestPriceItemService(parseInt(category));
// 		if (!listItems) {
// 			return res.status(400).json({ message: "Failed to get list items" });
// 		}
// 		return res.status(200).json({ data: listItems });
// 	} catch (error: any) {
// 		res.status(500).json({ message: error.message });
// 	}
// };
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
                            const ipfs = yield (0, uploadFile_service_1.uploadFileToIpfsService)(files.file.filepath);
                            if (files.file.mimetype.split("/")[0] === "image") {
                                fileURL = yield (0, uploadFile_service_1.uploadImageToStorageService)("nft", ipfs.cid, files.file.filepath);
                            }
                            else {
                                fileURL = yield (0, uploadFile_service_1.uploadVideoToStorageService)("nft", ipfs.cid, files.file.filepath);
                            }
                            resolve({
                                itemMedia: fileURL,
                                itemOriginMedia: ipfs.url,
                            });
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
exports.uploadItemMediaController = uploadItemMediaController;
const uploadItemPreviewMediaController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                        console.log(msg);
                        if (msg) {
                            rejects(msg);
                        }
                        else {
                            fileURL = yield (0, uploadFile_service_1.uploadImageToStorageService)("nft", Date.now().toString(), files.file.filepath);
                            resolve(fileURL);
                        }
                    }
                }));
            });
        };
        const result = yield promise();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.uploadItemPreviewMediaController = uploadItemPreviewMediaController;
const getListItemsSellingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId } = req.body;
        const listItems = yield (0, item_services_1.getListItemsSellingService)(parseInt(chainId));
        if (!listItems) {
            return res.status(400).json({ message: "Failed to get list items" });
        }
        return res.status(200).json({ data: listItems });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getListItemsSellingController = getListItemsSellingController;
// BOARC
//************* */
const getItemAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chainId, collectionId, pageId, pageSize } = req.params;
        const type = req.query.type;
        let items;
        if (type === "Upcoming") {
            items = yield (0, item_services_1.getItemNotAuctionService)(collectionId, parseInt(pageId), parseInt(pageSize));
        }
        else if (type === "Live") {
            items = yield (0, item_services_1.getItemInAuctionService)(chainId, collectionId, parseInt(pageId), parseInt(pageSize), true);
        }
        else {
            items = yield (0, item_services_1.getItemInAuctionService)(chainId, collectionId, parseInt(pageId), parseInt(pageSize), false);
        }
        return res.status(200).json(items);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot get item" });
});
exports.getItemAuctionController = getItemAuctionController;
const getItemByCollectionAndTokenIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId, itemTokenId } = req.params;
        const item = yield (0, item_services_1.getItemByCollectionAndTokenIdService)(collectionId, itemTokenId);
        return res.status(200).json(item);
    }
    catch (error) { }
    return res.status(500).json({ error: "Cannot get item" });
});
exports.getItemByCollectionAndTokenIdController = getItemByCollectionAndTokenIdController;
const getItemByIdInAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userAddress = req.query.userAddress;
    try {
        const item = yield (0, item_services_1.getItemByIdInAuctionService)(itemId, userAddress);
        return res.status(200).json(item);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Cannot get item" });
});
exports.getItemByIdInAuctionController = getItemByIdInAuctionController;
const getItemDetailInAuctionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userAddress = req.query.userAddress;
    try {
        const item = yield (0, item_services_1.getItemDetailInAuctionService)(itemId, userAddress);
        return res.status(200).json(item);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: "Cannot get item" });
});
exports.getItemDetailInAuctionController = getItemDetailInAuctionController;
