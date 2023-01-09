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
exports.getItemDetailInAuctionService = exports.getItemByIdInAuctionService = exports.getItemIdInPageService = exports.getItemByIdService = exports.getItemInAuctionService = exports.getItemNotAuctionService = exports.getItemByCollectionAndTokenIdService = exports.updatePriceItemService = exports.checkOwnerItemService = exports.getListItemsSellingService = exports.updateStatusItemService = exports.checkCreatorItemService = exports.updateOwnerOfManyItemService = exports.updateOwnerItemService = exports.changePriceService = exports.checkIsBaseItemService = exports.updateAttributesService = exports.deletePropertiesService = exports.updatePropertiesService = exports.freezeItemService = exports.checkItemExistsService = exports.checkItemIsFreezeService = exports.getManyItemService = exports.getOneItemService = exports.updateItemService = exports.getItemDetailService = exports.createItemService = void 0;
const contract_constant_1 = require("../constant/contract.constant");
const model_services_1 = require("./model.services");
const item_model_1 = __importDefault(require("../models/item.model"));
const other_services_1 = require("./other.services");
const collection_services_1 = require("./collection.services");
const interactions_services_1 = require("./interactions.services");
const units_1 = require("@ethersproject/units");
const auction_services_1 = require("./auction.services");
const price_services_1 = require("./price.services");
Object.defineProperty(exports, "changePriceService", { enumerable: true, get: function () { return price_services_1.changePriceService; } });
const default_constant_1 = require("../constant/default.constant");
const Order_services_1 = require("./Order.services");
const Order_services_2 = require("../services/Order.services");
const createItemService = (itemTokenId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, owner, creator, collectionId, itemStandard, chainId, attributes, properties, price, priceType, external_url = "", metaData = "", curUserAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield checkItemExistsService({ collectionId, itemTokenId, chainId });
    if (!check) {
        const newObj = {
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
            attributes,
            properties,
            price,
            priceType,
            external_url,
            metaData,
        };
        let item = yield (0, model_services_1.createService)(item_model_1.default, newObj);
        item = returnItemService(item);
        yield returnAdditionalDetailOfItemService(item, curUserAddress);
        return item;
    }
    return null;
});
exports.createItemService = createItemService;
const getItemIdInPageService = (itemName, owner, creator, collectionId, itemStandard, status, paymentToken, tokenSymbol, minPrice, maxPrice, sort, chainId, offer_status, pageSize, pageId) => __awaiter(void 0, void 0, void 0, function* () {
    const boarcId = yield (0, collection_services_1.getBoarcCollectionIdService)();
    const queryObj = {
        itemName: itemName !== undefined ? { $regex: itemName, $options: "i" } : undefined,
        owner: owner !== undefined ? { $regex: owner, $options: "i" } : undefined,
        creator: creator !== undefined ? { $regex: creator, $options: "i" } : undefined,
        itemStandard: itemStandard !== undefined ? { $regex: itemStandard, $options: "i" } : undefined,
        status: (status === null || status === void 0 ? void 0 : status.length) > 0 ? status : undefined,
        collectionId: (collectionId === null || collectionId === void 0 ? void 0 : collectionId.length) > 0 ? collectionId : { $ne: boarcId },
        chainId: (chainId === null || chainId === void 0 ? void 0 : chainId.length) > 0 ? chainId : undefined,
        paymentToken,
        offer_status,
    };
    const listItems = yield getManyItemService(Object.assign(Object.assign({}, queryObj), { itemMedia: { $ne: default_constant_1.DEFAULT_PICTURE } }), "_id price priceType listingPrice listingPriceType");
    const idArr = [];
    if (paymentToken || tokenSymbol) {
        const token = tokenSymbol
            ? yield (0, price_services_1.getTokenService)({ chainId: Number(process.env.DEFAULT_CHAINID), tokenSymbol })
            : yield (0, price_services_1.getTokenService)({ chainId: Number(process.env.DEFAULT_CHAINID), tokenAddress: paymentToken });
        if (!minPrice) {
            minPrice = 0;
        }
        if (!maxPrice) {
            maxPrice = Number.POSITIVE_INFINITY;
        }
        listItems.map((item) => {
            let price = (0, price_services_1.fromWeiToTokenService)(item.price, token.decimal);
            let priceType = item.priceType;
            if (item.listingPrice != 0) {
                price = (0, price_services_1.fromWeiToTokenService)(item.listingPrice, token.decimal);
                priceType = item.listingPriceType;
            }
            if (priceType === token.tokenSymbol) {
                if (price >= minPrice && price <= maxPrice) {
                    idArr.push(item._id);
                }
            }
        });
    }
    else {
        listItems.map((item) => {
            idArr.push(item._id);
        });
    }
    let returnItems = yield (0, model_services_1.queryItemsOfModelInPageService)(item_model_1.default, { _id: idArr }, pageId, pageSize, (0, other_services_1.getSortObj)(sort), "_id");
    return returnItems;
});
exports.getItemIdInPageService = getItemIdInPageService;
const getItemDetailService = (itemId, curUserAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let item = yield getOneItemService({ _id: (0, model_services_1.createObjIdService)(itemId) });
    yield returnAdditionalDetailOfItemService(item, curUserAddress);
    return item;
});
exports.getItemDetailService = getItemDetailService;
const getItemByIdService = (itemId, curUserAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let item = yield getOneItemService({ _id: (0, model_services_1.createObjIdService)(itemId) });
    yield returnAdditionalDetailOfItemService(item, curUserAddress, false);
    return item;
});
exports.getItemByIdService = getItemByIdService;
const getOneItemService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    let item = yield item_model_1.default
        .findOne(objQuery, properties)
        .populate("collectionId")
        .populate("ownerInfo")
        .populate("creatorInfo");
    if (item) {
        item = returnItemService(item);
    }
    return item;
});
exports.getOneItemService = getOneItemService;
const getManyItemService = (objectQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    let items = yield (0, model_services_1.findManyService)(item_model_1.default, objectQuery, properties);
    return items;
});
exports.getManyItemService = getManyItemService;
const updateItemService = (itemId, itemName, description, itemMedia, itemOriginMedia, itemPreviewMedia, curUserAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = {
        _id: itemId,
    };
    const updateObj = {
        itemName,
        description,
        itemMedia,
        itemOriginMedia,
        itemPreviewMedia,
    };
    let item = yield (0, model_services_1.updateOneService)(item_model_1.default, queryObj, updateObj);
    item = returnItemService(item);
    yield returnAdditionalDetailOfItemService(item, curUserAddress);
    return item;
});
exports.updateItemService = updateItemService;
const updateOwnerItemService = (itemId, owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, { owner });
        return returnItemService(result);
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.updateOwnerItemService = updateOwnerItemService;
const updateOwnerOfManyItemService = (itemId, owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, model_services_1.updateManyService)(item_model_1.default, { _id: itemId }, { owner });
        return result;
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.updateOwnerOfManyItemService = updateOwnerOfManyItemService;
const checkCreatorItemService = (itemId, creator) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: (0, model_services_1.createObjIdService)(itemId) });
    return item.creator === creator ? (creator === item.owner ? true : false) : false;
});
exports.checkCreatorItemService = checkCreatorItemService;
const checkItemIsFreezeService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    return result.isFreeze;
});
exports.checkItemIsFreezeService = checkItemIsFreezeService;
const checkIsBaseItemService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    const collection = yield (0, collection_services_1.getOneCollectionService)({ _id: result.collectionId });
    return (collection === null || collection === void 0 ? void 0 : collection.collectionAddress) === contract_constant_1.COLLECTION_ADDRESS[result.chainId].toLowerCase();
});
exports.checkIsBaseItemService = checkIsBaseItemService;
const checkItemExistsService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(item_model_1.default, queryObj);
});
exports.checkItemExistsService = checkItemExistsService;
const freezeItemService = (itemId, metaData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, { isFreeze: true, metaData: metaData });
    return returnItemService(result);
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
const updateAttributesService = (itemId, newItem) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, { attributes: newItem });
});
exports.updateAttributesService = updateAttributesService;
const returnUSDPriceService = (chainId, priceType, price) => __awaiter(void 0, void 0, void 0, function* () {
    const usdPrice = yield (0, price_services_1.changePriceService)(priceType, "usd", price);
    return { usdPrice: usdPrice };
});
const returnAdditionalDetailOfItemService = (item, userAddress, getDetail = true) => __awaiter(void 0, void 0, void 0, function* () {
    const getOrderItem = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, Order_services_1.getOneOrderService)({ itemId });
        return { order: (0, Order_services_2.returnOrderService)(result) };
    });
    if (item) {
        let price;
        let priceType;
        if (item.status === 1) {
            price = item.listingPrice;
            priceType = item.listingPriceType;
        }
        else {
            price = item.price;
            priceType = item.priceType;
        }
        const token = yield (0, price_services_1.getTokenService)({ chainId: item.chainId, tokenSymbol: priceType });
        if (getDetail === true) {
            const obj = yield (0, other_services_1.multiProcessService)([
                getOrderItem(item.itemId),
                (0, interactions_services_1.checkUserIsLikeItemService)(userAddress, item.itemId.toString()),
                (0, interactions_services_1.getInteractionsOfItemService)(item.itemId),
                returnUSDPriceService(item.chainId, priceType, price),
            ]);
            item.interaction = obj.interaction;
            item.currentPrice = (0, units_1.formatUnits)(price, token.decimal);
            item.priceLogo = token.logoURI;
            item.usdPrice = obj.usdPrice;
            item.isLike = obj.isLike;
            item.order = obj.order;
        }
        else {
            const obj = yield (0, other_services_1.multiProcessService)([
                (0, interactions_services_1.getInteractionsOfItemService)(item.itemId),
                returnUSDPriceService(item.chainId, priceType, price),
                (0, interactions_services_1.checkUserIsLikeItemService)(userAddress, item.itemId.toString()),
            ]);
            item.interaction = obj.itemInteraction;
            item.currentPrice = (0, units_1.formatUnits)(price, token.decimal);
            item.priceLogo = token.logoURI;
            item.usdPrice = obj.usdPrice;
            item.isLike = obj.isLike;
        }
    }
});
// const getTop10HighestPriceItemService = async (categoryType: number) => {
// 	const listItem = await findManyService(itemModel, { category: categoryType }, "_id", { price: -1 }, 10);
// 	return listItem;
// };
const updateStatusItemService = (itemId, objUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, Object.assign({}, objUpdate));
});
exports.updateStatusItemService = updateStatusItemService;
const getListItemsSellingService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const listItems = yield (0, model_services_1.findManyService)(item_model_1.default, { chainId, status: { $ne: 0 } }, "_id", { listingPrice: 1 });
    return listItems;
});
exports.getListItemsSellingService = getListItemsSellingService;
const checkOwnerItemService = (userAddress, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
    return item.owner === userAddress;
});
exports.checkOwnerItemService = checkOwnerItemService;
const updatePriceItemService = (itemId, objUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: itemId }, Object.assign({}, objUpdate));
    return returnItemService(item);
});
exports.updatePriceItemService = updatePriceItemService;
const returnItemService = (item) => {
    const returnValue = {
        itemId: item._id,
        chainId: item.chainId,
        itemTokenId: item.itemTokenId,
        itemName: item.itemName,
        description: item.description,
        itemMedia: item.itemMedia,
        itemOriginMedia: item.itemOriginMedia,
        itemPreviewMedia: item.itemPreviewMedia,
        properties: item.properties,
        attributes: item.attributes,
        owner: item.owner,
        creator: item.creator,
        status: parseInt(item.status),
        offer_status: parseInt(item.offer_status),
        price: item.price,
        listingPrice: item.listingPrice,
        priceType: item.priceType,
        listingPriceType: item.listingPriceType,
        collectionId: item.collectionId._id,
        standard: item.itemStandard,
        isFreeze: item.isFreeze,
        external_url: item.external_url,
        ownerInfo: item.ownerInfo,
        creatorInfo: item.creatorInfo,
        collection: item.collectionId,
    };
    return returnValue;
};
// BOARC AUCTION
/********************************************* */
const getItemByCollectionAndTokenIdService = (collectionId, itemTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const getItem = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield getOneItemService({ collectionId, itemTokenId });
        return { item: result };
    });
    const getCollection = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, collection_services_1.getOneCollectionService)({ _id: collectionId }, "collectionAddress");
        return { collection: result };
    });
    const obj = {};
    yield Promise.all([getItem(), getCollection()].map((func) => __awaiter(void 0, void 0, void 0, function* () {
        func = yield func;
        let key = Object.keys(func)[0];
        let value = Object.values(func)[0];
        obj[key] = value;
    })));
    const item = obj.item;
    const check = yield (0, auction_services_1.checkItemIsAuctionService)(item.itemId);
    item["auctionInfo"] = null;
    item["collectionAddress"] = obj.collection.collectionAddress;
    if (check) {
        // const auctionInfo = await getOneAuctionInfoByQueryService({ items: item.itemId });
        const auctionInfo = yield (0, auction_services_1.getOneAuctionService)({ items: item.itemId });
        item["auctionInfo"] = auctionInfo;
    }
    return item;
});
exports.getItemByCollectionAndTokenIdService = getItemByCollectionAndTokenIdService;
// ITEM NOT IN AUCTION
const getItemNotAuctionService = (collectionId, pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const auction = yield (0, auction_services_1.getManyAuctionService)({ collectionId }, "items");
    const itemInAuction = [];
    auction.map((auction) => {
        auction.items.map((item) => {
            itemInAuction.push(item.toString());
        });
    });
    const itemNotAuction = [];
    const allItems = yield getManyItemService({ collectionId: (0, model_services_1.createObjIdService)(collectionId) }, "_id");
    allItems.map((item) => {
        if (!itemInAuction.includes(item._id.toString())) {
            itemNotAuction.push(item._id);
        }
    });
    const returnItems = yield (0, model_services_1.queryItemsOfModelInPageService)(item_model_1.default, { _id: itemNotAuction }, pageId, pageSize, {}, "_id");
    return returnItems;
});
exports.getItemNotAuctionService = getItemNotAuctionService;
const getItemInAuctionService = (chainId, collectionId, pageId, pageSize, isLive) => __awaiter(void 0, void 0, void 0, function* () {
    const auctions = yield (0, auction_services_1.getManyAuctionService)({
        chainId,
        collectionId: (0, model_services_1.createObjIdService)(collectionId),
        isLive,
    });
    const arrItemId = [];
    auctions.map((auction) => {
        auction.items.map((item) => {
            arrItemId.push(item);
        });
    });
    const items = yield (0, model_services_1.queryItemsOfModelInPageService)(item_model_1.default, { _id: arrItemId }, pageId, pageSize, {}, "_id");
    return items;
});
exports.getItemInAuctionService = getItemInAuctionService;
const getItemByIdInAuctionService = (itemId, curUserAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const getItem = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield getItemByIdService(itemId, curUserAddress);
        return { item: result };
    });
    const getAuction = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, auction_services_1.getAuctionByItemIdService)(itemId);
        return { auction: result };
    });
    const obj = yield (0, other_services_1.multiProcessService)([getItem(), getAuction()]);
    const item = obj.item;
    item["auctionInfo"] = obj.auction;
    return item;
});
exports.getItemByIdInAuctionService = getItemByIdInAuctionService;
const getItemDetailInAuctionService = (itemId, curUserAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const getItem = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield getItemByIdService(itemId, curUserAddress);
        return { item: result };
    });
    const getAuction = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, auction_services_1.getAuctionByItemIdService)(itemId);
        return { auction: result };
    });
    const obj = yield (0, other_services_1.multiProcessService)([getItem(), getAuction()]);
    const item = obj.item;
    item["auctionInfo"] = obj.auction;
    return item;
});
exports.getItemDetailInAuctionService = getItemDetailInAuctionService;
