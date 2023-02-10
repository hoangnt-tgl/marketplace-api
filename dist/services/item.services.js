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
exports.checkItemExistsService = exports.getAllItemService = exports.getOneItemService = exports.getListItemByOwnerService = exports.getListItemByCreatedService = exports.getListRandomItemService = exports.getListSelectItemService = exports.checkChainIdItemService = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const interaction_model_1 = __importDefault(require("../models/interaction.model"));
const getOneItemService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    const item = yield item_model_1.default
        .findOne(objQuery, properties)
        .lean()
        .populate({ path: "collectionInfo" })
        .populate({ path: "ownerInfo", select: "userAddress avatar username" })
        .populate({ path: "creatorInfo", select: "userAddress avatar username" });
    if (!item)
        return null;
    item.countFav = yield (0, model_services_1.countByQueryService)(interaction_model_1.default, { itemId: item._id, state: true });
    return item;
});
exports.getOneItemService = getOneItemService;
const checkItemExistsService = (queryObj) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(item_model_1.default, queryObj);
});
exports.checkItemExistsService = checkItemExistsService;
const getAllItemService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    objQuery = (0, other_services_1.removeUndefinedOfObj)(objQuery);
    let itemList = yield item_model_1.default
        .find(objQuery, properties)
        .lean()
        .populate({ path: "collectionInfo" })
        .populate({ path: "ownerInfo", select: "userAddress avatar username" })
        .populate({ path: "creatorInfo", select: "userAddress avatar username" });
    itemList = yield Promise.all(itemList.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        let newItem = item;
        newItem.countFav = yield (0, model_services_1.countByQueryService)(interaction_model_1.default, { itemId: item._id, state: true });
        return newItem;
    })));
    itemList = itemList.sort((a, b) => b.countFav - a.countFav);
    return itemList;
});
exports.getAllItemService = getAllItemService;
const checkChainIdItemService = (id, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: id });
    if (Number(items.chainId) === chainId) {
        return true;
    }
    else
        return false;
});
exports.checkChainIdItemService = checkChainIdItemService;
const getListSelectItemService = (listItem) => __awaiter(void 0, void 0, void 0, function* () {
    let item = [];
    yield Promise.all(listItem.map((items) => __awaiter(void 0, void 0, void 0, function* () {
        const getItem = yield getOneItemService({ _id: items.itemId });
        item.push(getItem);
    })));
    return item;
});
exports.getListSelectItemService = getListSelectItemService;
const randomListItem = (arr, n) => __awaiter(void 0, void 0, void 0, function* () {
    let result = [];
    let randomIndex;
    let length = arr.length;
    for (let i = 0; i < n; i++) {
        randomIndex = Math.floor(Math.random() * length);
        result.push(arr.splice(randomIndex, 1)[0]);
        length--;
    }
    return result;
});
const getListRandomItemService = () => __awaiter(void 0, void 0, void 0, function* () {
    const allItem = yield (0, model_services_1.findManyService)(item_model_1.default, {});
    const result = yield randomListItem(allItem, 10);
    return result;
});
exports.getListRandomItemService = getListRandomItemService;
const getListItemByCreatedService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield (0, model_services_1.findManyService)(item_model_1.default, { creator: userAddress });
    return item;
});
exports.getListItemByCreatedService = getListItemByCreatedService;
const getListItemByOwnerService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const itemAll = yield (0, model_services_1.findManyService)(item_model_1.default, {});
    const item = [];
    Promise.all(itemAll.map((items) => __awaiter(void 0, void 0, void 0, function* () {
        if (items.creator !== userAddress) {
            const owner = items.owner;
            if (owner.includes(userAddress)) {
                item.push(items);
            }
        }
    })));
    return item;
});
exports.getListItemByOwnerService = getListItemByOwnerService;
