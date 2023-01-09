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
exports.getItemIdInPageService1 = exports.checkOwnerItem = exports.createItemDropController1 = exports.createItemService1 = exports.updateOwnerItem1155 = exports.getTicketCardService = exports.getBoxService = exports.getAsset1155 = exports.getItem1155 = exports.getBox1155 = exports.checkItemOfferStatusService = exports.checkItemStatusService = exports.getItemsByCollectionService = exports.getBoxAssetService = exports.getSearchItemByIdService = exports.getSearchItemIdInPageService = exports.getItemIdInPageService = exports.updatePriceItemService = exports.checkOwnerItemService = exports.getListItemsSellingService = exports.updateStatusItemService = exports.checkCreatorItemService = exports.updateOwnerItemService = exports.changePriceService = exports.checkIsBaseItemService = exports.deletePropertiesService = exports.updatePropertiesService = exports.freezeItemService = exports.getMetadataService = exports.checkItemExistsService = exports.checkItemIsFreezeService = exports.getManyItemService = exports.getOneItemService = exports.updateItemService = exports.getItemDetailService = exports.createItemService = void 0;
const asset_erc1155_json_1 = __importDefault(require("../abis/asset_erc1155.json"));
const box1155_json_1 = __importDefault(require("../abis/box1155.json"));
const contract_constant_1 = require("../constant/contract.constant");
const default_constant_1 = require("../constant/default.constant");
const item_model_1 = __importDefault(require("../models/item.model"));
const uploadIPFS_1 = require("../utils/uploadIPFS");
const collection_services_1 = require("./collection.services");
const default_constant_2 = require("../constant/default.constant");
const history_services_1 = require("../services/history.services");
const interactions_services_1 = require("./interactions.services");
const model_services_1 = require("./model.services");
const Order_services_1 = require("./Order.services");
const other_services_1 = require("./other.services");
const price_services_1 = require("./price.services");
Object.defineProperty(exports, "changePriceService", { enumerable: true, get: function () { return price_services_1.changePriceService; } });
const Order_model_1 = __importDefault(require("../models/Order.model"));
const web3_services_1 = require("./web3.services");
const provider_services_1 = require("./provider.services");
const contract_services_1 = require("../services/contract.services");
const MetaSpacecyTicketCard_json_1 = __importDefault(require("../abis/MetaSpacecyTicketCard.json"));
const createItemService = (itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, owner, creator, collectionId, itemStandard, chainId, properties, price, priceType, external_url = "", metadata = "") => __awaiter(void 0, void 0, void 0, function* () {
    const newItem = {
        itemTokenId,
        itemName,
        description,
        itemMedia,
        itemOriginMedia,
        itemPreviewMedia,
        owner,
        creator,
        collectionId: (0, model_services_1.createObjIdService)(collectionId),
        itemStandard,
        chainId,
        properties,
        price,
        priceType,
        external_url,
        metadata,
    };
    let item = yield (0, model_services_1.createService)(item_model_1.default, newItem);
    return item;
});
exports.createItemService = createItemService;
const getItemIdInPageService = (itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, sort, chainId, offer_status, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {
        itemName: itemName ? { $regex: itemName, $options: "i" } : undefined,
        owner: owner && owner.length > 0 ? { $in: owner } : undefined,
        creator: creator ? { $regex: creator, $options: "i" } : undefined,
        itemStandard: itemStandard ? { $regex: itemStandard, $options: "i" } : undefined,
        status: status && status.length > 0 ? { $in: status } : undefined,
        collectionId: collectionId && collectionId.length > 0 ? collectionId : undefined,
        chainId: chainId && chainId.length > 0 ? { $in: chainId } : undefined,
        priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
        offer_status,
        isINO: owner && owner.length > 0 ? undefined : 0,
    };
    const listItems = yield getManyItemService(queryObj, "", (0, other_services_1.getSortObj)(sort));
    const idArr = [];
    if (paymentToken || tokenSymbol) {
        const token = tokenSymbol
            ? yield (0, price_services_1.getTokenService)({ chainId: default_constant_1.DEFAULT_CHAIN_ID, tokenSymbol })
            : yield (0, price_services_1.getTokenService)({ chainId: default_constant_1.DEFAULT_CHAIN_ID, tokenAddress: paymentToken });
        minPrice = minPrice ? minPrice : 0;
        maxPrice = maxPrice ? maxPrice : Number.POSITIVE_INFINITY;
        const queryObjByPriceListing = {
            status: 1,
            priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
        };
        const listItemsWithPriceListing = yield getManyItemService(queryObjByPriceListing, "", (0, other_services_1.getSortObj)(sort));
        listItemsWithPriceListing.map((item) => {
            let price = (0, price_services_1.fromWeiToTokenService)(item.price, token.decimal);
            let priceType = item.priceType;
            if (priceType === token.tokenSymbol) {
                if (price >= minPrice && price <= maxPrice) {
                    idArr.push({ _id: item._id.toString() });
                }
            }
        });
    }
    else {
        listItems.map((item) => {
            idArr.push({ _id: item._id.toString() });
        });
    }
    let returnItems = (0, other_services_1.paginateArrayService)(idArr, pageSize, pageId);
    return returnItems;
});
exports.getItemIdInPageService = getItemIdInPageService;
const getItemIdInPageService1 = (itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, sort, chainId, offer_status, isINO, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {
        itemName: itemName ? { $regex: itemName, $options: "i" } : undefined,
        owner: owner && owner.length > 0 ? { $in: owner } : undefined,
        creator: creator ? { $regex: creator, $options: "i" } : undefined,
        itemStandard: itemStandard ? { $regex: itemStandard, $options: "i" } : undefined,
        status: status && status.length > 0 ? { $in: status } : undefined,
        collectionId: collectionId && collectionId.length > 0 ? collectionId : undefined,
        chainId: chainId && chainId.length > 0 ? { $in: chainId } : undefined,
        priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
        offer_status,
        isINO: isINO && (isINO === true) ? undefined : false,
    };
    const listItems = yield getManyItemService(queryObj, "", (0, other_services_1.getSortObj)(sort));
    const idArr = [];
    if (paymentToken || tokenSymbol) {
        const token = tokenSymbol
            ? yield (0, price_services_1.getTokenService)({ chainId: default_constant_1.DEFAULT_CHAIN_ID, tokenSymbol })
            : yield (0, price_services_1.getTokenService)({ chainId: default_constant_1.DEFAULT_CHAIN_ID, tokenAddress: paymentToken });
        minPrice = minPrice ? minPrice : 0;
        maxPrice = maxPrice ? maxPrice : Number.POSITIVE_INFINITY;
        const queryObjByPriceListing = {
            status: 1,
            priceType: tokenSymbol ? tokenSymbol.toLowerCase() : undefined,
        };
        const listItemsWithPriceListing = yield getManyItemService(queryObjByPriceListing, "", (0, other_services_1.getSortObj)(sort));
        listItemsWithPriceListing.map((item) => {
            let price = (0, price_services_1.fromWeiToTokenService)(item.price, token.decimal);
            let priceType = item.priceType;
            if (priceType === token.tokenSymbol) {
                if (price >= minPrice && price <= maxPrice) {
                    idArr.push({ _id: item._id.toString() });
                }
            }
        });
    }
    else {
        listItems.map((item) => {
            idArr.push({ _id: item._id.toString() });
        });
    }
    let returnItems = (0, other_services_1.paginateArrayService)(idArr, pageSize, pageId);
    return returnItems;
});
exports.getItemIdInPageService1 = getItemIdInPageService1;
const getSearchItemIdInPageService = (text, pageSize, pageId, sort) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {
        $or: [{ description: { $regex: text, $options: "i" } }, { itemName: { $regex: text, $options: "i" } }],
        isINO: false,
    };
    const listItems = yield (0, model_services_1.queryItemsOfModelInPageService)(item_model_1.default, queryObj, pageId, pageSize, (0, other_services_1.getSortObj)(sort));
    console.log(listItems);
    return listItems;
});
exports.getSearchItemIdInPageService = getSearchItemIdInPageService;
const getItemDetailService = (itemId, curUserAddress, detail = true) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield getOneItemService({ _id: (0, model_services_1.createObjIdService)(itemId) });
    const extraItem = yield returnAdditionalDetailOfItemService(item, curUserAddress, detail);
    return extraItem;
});
exports.getItemDetailService = getItemDetailService;
const getSearchItemByIdService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: (0, model_services_1.createObjIdService)(itemId) });
    return item;
});
exports.getSearchItemByIdService = getSearchItemByIdService;
const getItemsByCollectionService = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    let items = yield (0, model_services_1.findManyService)(item_model_1.default, { collectionId: (0, model_services_1.createObjIdService)(collectionId) });
    return items;
});
exports.getItemsByCollectionService = getItemsByCollectionService;
const getOneItemService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const item = yield item_model_1.default
        .findOne(objQuery, properties)
        .lean()
        .populate({ path: "collectionInfo" })
        .populate({ path: "ownerInfo", select: "userAddress avatar username" })
        .populate({ path: "creatorInfo", select: "userAddress avatar username" });
    return item;
});
exports.getOneItemService = getOneItemService;
const getManyItemService = (objectQuery, properties = "", sorObj = { createdAt: -1 }) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield (0, model_services_1.findManyService)(item_model_1.default, objectQuery, properties, sorObj);
    return items;
});
exports.getManyItemService = getManyItemService;
const updateItemService = (itemId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {
        _id: (0, model_services_1.createObjIdService)(itemId),
    };
    const updateObj = {
        itemName,
        description,
        itemMedia,
        itemOriginMedia,
        itemPreviewMedia,
    };
    const item = yield (0, model_services_1.updateOneService)(item_model_1.default, queryObj, updateObj);
    return item;
});
exports.updateItemService = updateItemService;
const updateOwnerItemService = (itemId, newOwner, oldOwner = "") => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield getOneItemService({ _id: itemId });
    let owners = item.owner;
    //ERC-721
    if (item.itemStandard === "ERC721") {
        owners.pop();
        owners.push(newOwner);
    }
    //ERC1155
    else {
        const balance = (yield (0, contract_services_1.getBalanceOfToken1155)(item, oldOwner)) || 0;
        owners.push(newOwner);
        if (balance === 0) {
            owners = owners.filter((owner) => owner !== oldOwner.toLowerCase());
        }
    }
    owners = [...new Set(owners)];
    const result = yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, { owner: owners });
    return result;
});
exports.updateOwnerItemService = updateOwnerItemService;
const checkCreatorItemService = (itemId, creator) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: (0, model_services_1.createObjIdService)(itemId) });
    return item.creator === creator ? (item.owner.includes(creator) ? true : false) : false;
});
exports.checkCreatorItemService = checkCreatorItemService;
const checkItemIsFreezeService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: (0, model_services_1.createObjIdService)(itemId) });
    return result.isFreeze;
});
exports.checkItemIsFreezeService = checkItemIsFreezeService;
const checkIsBaseItemService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: item.collectionId });
    return collection.collectionAddress === contract_constant_1.MetaSpacecyAssetShared[collection.chainId].toLowerCase();
});
exports.checkIsBaseItemService = checkIsBaseItemService;
const checkItemExistsService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(item_model_1.default, queryObj);
});
exports.checkItemExistsService = checkItemExistsService;
const getMetadataService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield getOneItemService({ _id: itemId });
    const metadata = {
        name: item.itemName,
        description: item.description,
        image: item.itemOriginMedia,
        properties: item.properties,
    };
    //---OLD---
    // const file = await addIPFS(JSON.stringify(metadata));
    //---NEW---
    const ipfs = yield (0, uploadIPFS_1.pinataUploadJsonIPFS)(JSON.stringify(metadata));
    return { tokenId: item.itemTokenId, cid: ipfs };
});
exports.getMetadataService = getMetadataService;
const freezeItemService = (itemId, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield item_model_1.default.updateOne({ _id: itemId }, { isFreeze: true, metadata });
    console.log("result: ", result);
    return result;
});
exports.freezeItemService = freezeItemService;
const updatePropertiesService = (itemId, properties) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < properties.length; i++) {
        yield (0, model_services_1.updateObjService)(item_model_1.default, { _id: itemId }, "properties", properties[i].property, properties[i].value);
    }
});
exports.updatePropertiesService = updatePropertiesService;
const deletePropertiesService = (itemId, properties) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < properties.length; i++) {
        yield (0, model_services_1.deleteObjService)(item_model_1.default, { _id: itemId }, "properties", properties[i]);
    }
});
exports.deletePropertiesService = deletePropertiesService;
const returnUSDPriceService = (priceType, price) => __awaiter(void 0, void 0, void 0, function* () {
    const usdPrice = yield (0, price_services_1.changePriceService)(priceType, "usd", price);
    return { usdPrice: usdPrice };
});
const returnAdditionalDetailOfItemService = (item, userAddress, getDetail = true) => __awaiter(void 0, void 0, void 0, function* () {
    let itemInfo;
    const getOrderItem = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, Order_services_1.getManyOrderService)({ itemId: item._id });
        return { orders: result };
    });
    item.isBox = item.collectionInfo.category === 7;
    let price = item.price;
    let priceType = item.priceType;
    const token = yield (0, price_services_1.getTokenService)({ chainId: item.chainId, tokenSymbol: priceType });
    if (getDetail === true) {
        const obj = yield (0, other_services_1.multiProcessService)([
            getOrderItem(),
            (0, interactions_services_1.checkUserIsLikeItemService)(userAddress, item._id.toString()),
            (0, interactions_services_1.getInteractionsOfItemService)(item._id),
            returnUSDPriceService(priceType, price),
        ]);
        itemInfo = Object.assign(Object.assign({}, item), { interaction: obj.itemInteraction, currentPrice: (0, price_services_1.fromWeiToTokenService)(price, token === null || token === void 0 ? void 0 : token.decimal), priceLogo: token === null || token === void 0 ? void 0 : token.logoURI, usdPrice: obj.usdPrice, isLike: obj.isLike, order: obj.orders });
    }
    else {
        const obj = yield (0, other_services_1.multiProcessService)([
            (0, interactions_services_1.getInteractionsOfItemService)(item._id),
            returnUSDPriceService(priceType, price),
            (0, interactions_services_1.checkUserIsLikeItemService)(userAddress, item._id.toString()),
        ]);
        itemInfo = Object.assign(Object.assign({}, item), { interaction: obj.itemInteraction, currentPrice: (0, price_services_1.fromWeiToTokenService)(price, token.decimal), priceLogo: token.logoURI, usdPrice: obj.usdPrice, isLike: obj.isLike });
    }
    return itemInfo;
});
const updateStatusItemService = (itemId, objUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    // fix function
    return yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId, type: 0 }, Object.assign({}, objUpdate));
});
exports.updateStatusItemService = updateStatusItemService;
const checkItemStatusService = (itemId, typeOrder) => __awaiter(void 0, void 0, void 0, function* () {
    let order;
    order = yield (0, model_services_1.findOneService)(Order_model_1.default, { itemId, type: typeOrder });
    return order;
});
exports.checkItemStatusService = checkItemStatusService;
const checkItemOfferStatusService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, model_services_1.findOneService)(Order_model_1.default, { itemId: (0, model_services_1.createObjIdService)(itemId), type: 1 });
    return order;
});
exports.checkItemOfferStatusService = checkItemOfferStatusService;
const getListItemsSellingService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const listItems = yield (0, model_services_1.findManyService)(item_model_1.default, { chainId, status: { $ne: 0 } }, "_id", {
        listingPrice: 1,
    });
    return listItems;
});
exports.getListItemsSellingService = getListItemsSellingService;
const checkOwnerItemService = (userAddress, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: (0, model_services_1.createObjIdService)(itemId), owner: userAddress });
    return item;
});
exports.checkOwnerItemService = checkOwnerItemService;
const updatePriceItemService = (itemId, objUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, Object.assign({}, objUpdate));
    return item;
});
exports.updatePriceItemService = updatePriceItemService;
//BOX
const getAsset1155 = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const collectionAsset = yield (0, collection_services_1.getCollectionAssetERC1155Service)(chainId);
    const items = yield item_model_1.default.find({ collectionId: collectionAsset._id }).populate({ path: "collectionInfo" }).lean();
    const wormhole = (0, contract_services_1.getWormholeContractService)(chainId);
    const returnItem = [];
    for (let i = 0; i < items.length; i++) {
        let upgradeFee = 0;
        try {
            upgradeFee = yield wormhole.methods.UPGRADE_FEE(parseInt(items[i].itemTokenId)).call();
        }
        catch (error) { }
        items[i].isBox = ((_a = items[i].collectionInfo) === null || _a === void 0 ? void 0 : _a.category) === 7;
        const item = Object.assign(Object.assign({}, items[i]), { upgradeFee });
        returnItem.push(item);
    }
    return returnItem;
});
exports.getAsset1155 = getAsset1155;
const getBoxService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionBox = yield (0, collection_services_1.getCollectionBoxERC1155Service)(chainId);
    const items = yield item_model_1.default
        .find({ collectionId: collectionBox._id })
        .lean()
        .populate({ path: "collectionInfo" })
        .lean();
    for (let i = 0; i < items.length; i++) {
        items[i].isBox = items[i].collectionInfo.category === 7;
    }
    return items;
});
exports.getBoxService = getBoxService;
const getBoxAssetService = (chainId, pageId, pageSize, type = [0, 1, 2]) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionBox = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, collection_services_1.getCollectionBoxERC1155Service)(chainId);
        return { collectionBox: result };
    });
    const collectionAsset = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, collection_services_1.getCollectionAssetERC1155Service)(chainId);
        return { collectionAsset: result };
    });
    const collectionTicketCard = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, collection_services_1.getCollectionCardService)(chainId);
        return { collectionTicketCard: result };
    });
    const arrayFunction = [];
    if (type.includes(0)) {
        arrayFunction.push(collectionBox());
    }
    if (type.includes(1)) {
        arrayFunction.push(collectionAsset());
    }
    if (type.includes(2)) {
        arrayFunction.push(collectionTicketCard());
    }
    const result = yield (0, other_services_1.multiProcessService)(arrayFunction);
    const items = yield (0, model_services_1.queryItemsOfModelInPageService)(item_model_1.default, { collectionId: Object.values(result) }, pageId, pageSize);
    return items;
});
exports.getBoxAssetService = getBoxAssetService;
const getBox1155 = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const contract = (0, web3_services_1.createContractService)(web3, contract_constant_1.MetaSpacecyMysteriousBox[chainId], box1155_json_1.default);
    const collection = yield (0, collection_services_1.getOneCollectionService)({
        collectionAddress: contract_constant_1.MetaSpacecyMysteriousBox[chainId],
    });
    for (let tokenId = 0; tokenId < 6; tokenId++) {
        const check = yield getOneItemService({ collectionId: collection._id, itemTokenId: tokenId });
        if (!check) {
            const tokenURI = yield contract.methods.tokenURI(tokenId).call();
            const metadata = yield (0, other_services_1.getDataFromURL)(tokenURI);
            const newObj = {
                itemTokenId: tokenId,
                itemName: metadata.name,
                description: metadata.description,
                properties: metadata.properties,
                itemMedia: metadata.image,
                itemOriginMedia: metadata.image,
                itemPreviewMedia: metadata.image,
                isFreeze: true,
                creator: collection.userAddress,
                collectionId: collection._id,
                itemStandard: "ERC1155",
                chainId,
                metadata: tokenURI,
            };
            let item = yield (0, model_services_1.createService)(item_model_1.default, newObj);
            yield item.save();
        }
    }
});
exports.getBox1155 = getBox1155;
const getItem1155 = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(chainId);
    const contract = (0, web3_services_1.createContractService)(web3, contract_constant_1.MetaSpacecyCreatureAccessory[chainId], asset_erc1155_json_1.default);
    const collection = yield (0, collection_services_1.getOneCollectionService)({
        collectionAddress: contract_constant_1.MetaSpacecyCreatureAccessory[chainId],
    });
    for (let tokenId = 0; tokenId < 6; tokenId++) {
        const check = yield getOneItemService({ collectionId: collection._id, itemTokenId: tokenId });
        if (!check) {
            const tokenURI = yield contract.methods.tokenURI(tokenId).call();
            const metadata = yield (0, other_services_1.getDataFromURL)(tokenURI);
            const newObj = {
                itemTokenId: tokenId,
                itemName: metadata.name,
                description: metadata.description,
                properties: metadata.properties,
                itemMedia: metadata.image,
                itemOriginMedia: metadata.image,
                itemPreviewMedia: metadata.image,
                isFreeze: true,
                creator: collection.userAddress,
                collectionId: collection._id,
                itemStandard: "ERC1155",
                chainId,
                metadata: tokenURI,
            };
            let item = yield (0, model_services_1.createService)(item_model_1.default, newObj);
            yield item.save();
        }
    }
});
exports.getItem1155 = getItem1155;
const getTicketCardService = (collectionCard) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, provider_services_1.getWeb3ByChainId)(collectionCard.chainId);
    const cardContract = (0, web3_services_1.createContractService)(web3, contract_constant_1.MetaSpacecyTicketCard[collectionCard.chainId], MetaSpacecyTicketCard_json_1.default);
    const currentCardId = yield cardContract.methods.currentIdSupported().call();
    let cardItem = yield item_model_1.default.findOne({ collectionId: collectionCard._id, itemTokenId: currentCardId });
    if (!cardItem) {
        const tokenURI = yield cardContract.methods.tokenURI(currentCardId).call();
        const data = yield (0, other_services_1.getDataFromURL)(tokenURI);
        cardItem = yield (0, model_services_1.createService)(item_model_1.default, {
            itemTokenId: currentCardId,
            itemName: data.name,
            description: data.description,
            itemMedia: data.image,
            itemOriginMedia: data.image,
            itemPreviewMedia: data.image,
            metadata: tokenURI,
            properties: data.properties,
            creator: collectionCard.userAddress,
            collectionId: collectionCard._id,
            itemStandard: collectionCard.collectionStandard,
            chainId: collectionCard.chainId,
            isFreeze: true,
        });
    }
    return cardItem;
});
exports.getTicketCardService = getTicketCardService;
//Get Item By ItemId and CollectionId
const checkOwnerItem = (itemTokenId, collectionId, userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const getItem = yield item_model_1.default.find({ itemTokenId: itemTokenId, collectionId: collectionId });
    let check = true;
    for (let i = 0; i < ((_b = getItem[0]) === null || _b === void 0 ? void 0 : _b.owner.length); i++) {
        if (((_c = getItem[0]) === null || _c === void 0 ? void 0 : _c.owner[i]) === userAddress) {
            check = false;
        }
    }
    return checkOwnerItem;
});
exports.checkOwnerItem = checkOwnerItem;
//Update Owner Item 1155
const updateOwnerItem1155 = (itemTokenId, collectionId, userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h;
    let check = true;
    const getItem = yield item_model_1.default.find({ itemTokenId: itemTokenId, collectionId: collectionId });
    console.log(getItem === null || getItem === void 0 ? void 0 : getItem.itemStandard);
    if ((getItem === null || getItem === void 0 ? void 0 : getItem.itemStandard) === "ERC721") {
        const getItem721 = yield item_model_1.default.find({ collectionId: collectionId });
        for (let i = 0; i < getItem721.length; i++) {
            if (((_d = getItem721[i]) === null || _d === void 0 ? void 0 : _d.owner[0].toString()) === userAddress) {
                check = false;
            }
        }
    }
    else {
        for (let i = 0; i < ((_e = getItem[0]) === null || _e === void 0 ? void 0 : _e.owner.length); i++) {
            if (((_f = getItem[0]) === null || _f === void 0 ? void 0 : _f.owner[i]) === userAddress) {
                check = false;
            }
        }
    }
    let owner = (_g = getItem[0]) === null || _g === void 0 ? void 0 : _g.owner;
    if (check === true) {
        owner[(_h = getItem[0]) === null || _h === void 0 ? void 0 : _h.owner.length] = userAddress;
    }
    yield (0, model_services_1.updateOneService)(item_model_1.default, { collectionId, itemTokenId }, { owner });
    return check;
});
exports.updateOwnerItem1155 = updateOwnerItem1155;
// Custom CreateItemService
const createItemService1 = (itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, creator, collectionId, itemStandard, chainId, price, priceType) => __awaiter(void 0, void 0, void 0, function* () {
    const newItem = {
        itemTokenId,
        itemName,
        description,
        itemMedia,
        itemOriginMedia,
        itemPreviewMedia,
        creator,
        collectionId: (0, model_services_1.createObjIdService)(collectionId),
        itemStandard,
        chainId,
        price,
        priceType,
    };
    let item = yield (0, model_services_1.createService)(item_model_1.default, newItem);
    return item;
});
exports.createItemService1 = createItemService1;
// Create Item
const createItemDropController1 = (collectionId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, price, priceType, itemTokenId, image, totalItem) => __awaiter(void 0, void 0, void 0, function* () {
    const txHash = "";
    const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: (0, model_services_1.createObjIdService)(collectionId) });
    const collectionInfo = yield (0, collection_services_1.getCollectionIdInfoService)(collectionId);
    const item = collectionInfo.item;
    const productId = (Number(collectionInfo.item.length) + 1).toString();
    const availableItem = totalItem;
    const update = {
        productId,
        itemTokenId,
        itemName,
        image,
        totalItem,
        availableItem
    };
    item[Number(collectionInfo.item.length)] = update;
    const totalNFT = Number(collectionInfo.totalNFT) + totalItem;
    const availableNFT = Number(collectionInfo.availableNFT) + availableItem;
    //Create on database
    const item1 = yield createItemService1(itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, collection.userAddress, collection._id.toString(), collection.collectionStandard, Number(collection.chainId), price, priceType);
    yield (0, collection_services_1.updateCollectionInfo)({ collectionId }, { totalNFT, availableNFT, item });
    yield (0, history_services_1.createHistoryService)(collection._id, item1._id, default_constant_2.NULL_ADDRESS, collection.userAddress, price.toString(), priceType, totalItem, txHash, 1);
    const response = {
        data: item1,
    };
    return (response);
});
exports.createItemDropController1 = createItemDropController1;
