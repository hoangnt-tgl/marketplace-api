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
exports.checkItemExistsService = exports.getAllItemService = exports.getOneItemService = exports.getVolumeItemService = exports.getVolumeAllItemService = exports.updateItemService = exports.getTransactionService = exports.getListItemByOwnerService = exports.getListItemByCreatedService = exports.getListRandomItemService = exports.getListSelectItemService = exports.checkChainIdItemService = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const history_model_1 = __importDefault(require("../models/history.model"));
const collection_model_1 = __importDefault(require("../models/collection.model"));
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const interaction_model_1 = __importDefault(require("../models/interaction.model"));
const history_services_1 = require("./history.services");
const axios_1 = __importDefault(require("axios"));
const aptos_services_1 = require("./aptos.services");
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
    let items = [];
    yield Promise.all(listItem.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield getOneItemService({ _id: id });
        if (item) {
            items.push(item);
        }
    })));
    return items;
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
    const item = yield getAllItemService({ creator: userAddress });
    return item;
});
exports.getListItemByCreatedService = getListItemByCreatedService;
const getListItemByOwnerService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const itemAll = yield getAllItemService({});
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
const getTransactions = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/transactions`);
    const result = [];
    const data = response.data;
    yield Promise.all(data.map((dataM) => __awaiter(void 0, void 0, void 0, function* () {
        const history = yield (0, history_services_1.getHistoryByUserService)(address, {});
        const hash = history.map((hash) => hash.txHash);
        // console.log(hash);
        yield Promise.all(hash.map((txhash) => __awaiter(void 0, void 0, void 0, function* () {
            if (String(dataM.hash) !== String(txhash)) {
                result.push(String(dataM.hash));
                console.log(String(dataM.hash));
            }
        })));
    })));
    const transactions = result;
    return transactions;
});
const getTransactionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const address = "0xfe72e4ba98b4052434f7313c9c93aea1a0ee6f0c54892e6435fb92ea53cfda0a";
    const transactions = yield getTransactions(address);
    return transactions;
});
exports.getTransactionService = getTransactionService;
const updateItemService = (id, send, receive, quantity, txHash) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield getOneItemService({ _id: id });
    if (item) {
        let owner = item.owner;
        const quantitySend = yield (0, aptos_services_1.getBalanceTokenForAccount)(send, item === null || item === void 0 ? void 0 : item.creator, item === null || item === void 0 ? void 0 : item.collectionInfo.collectionName, item === null || item === void 0 ? void 0 : item.itemName, item === null || item === void 0 ? void 0 : item.chainId);
        if (quantitySend === "0") {
            owner = owner.filter((address) => address !== send);
        }
        ;
        if (!owner.includes(receive)) {
            owner.push(receive);
        }
        ;
        // const owner: String[] = item.owner;
        // let check = false;
        // owner.map((address: String, index) => {
        // 	if(send === address){
        // 		owner.splice(index, 1);
        // 	}
        // 	if(receive === address){
        // 		check = true;
        // 	}
        // });
        // if(!check){
        // 	owner.push(receive);
        // }
        const newHistory = {
            collectionId: (0, model_services_1.createObjIdService)(String(item.collectionId)),
            itemId: (0, model_services_1.createObjIdService)(String(item._id)),
            from: String(send),
            to: String(receive),
            price: 0,
            quantity: Number(quantity),
            txHash: String(txHash),
            type: 4,
        };
        yield (0, model_services_1.createService)(history_model_1.default, newHistory);
        const itemUpdate = yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: id }, { owner });
        return itemUpdate;
    }
    else
        return null;
});
exports.updateItemService = updateItemService;
const getVolumeAllItemService = () => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield getAllItemService({});
    yield Promise.all(item.map((items) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, exports.getVolumeItemService)(String(items._id));
        // const volume: { volume: Number, date: Number, month: Number, year: Number } = await getVolumeItemService(String(items._id));
        // console.log(volume);
    })));
    return 1;
});
exports.getVolumeAllItemService = getVolumeAllItemService;
const getVolumeItemService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let result = [];
    let volume = { avgPrice: 0, date: new Date(), days: 0, month: 0, year: 0 };
    const history = yield (0, history_services_1.getHistoryByItemService)(id, { type: 7 });
    console.log(id);
    history.forEach((history) => {
        let index = result.findIndex((volume) => volume.days == history.createdAt.getDate() && volume.month == history.createdAt.getMonth() && volume.year == history.createdAt.getFullYear());
        console.log(index);
        if (index !== -1) {
            let newVolume = result[index];
            newVolume.avgPrice = Number(newVolume.avgPrice) + Number(history.price);
            result[index] = newVolume;
        }
        else {
            volume = { avgPrice: 0, date: new Date(), days: 0, month: 0, year: 0 };
            volume.avgPrice = Number(history.price);
            volume.date = history.createdAt;
            volume.days = Number(history.createdAt.getDate());
            volume.month = Number(history.createdAt.getMonth());
            volume.year = Number(history.createdAt.getFullYear());
            console.log("Volume: ", volume);
            result.push(volume);
        }
    });
    return result;
});
exports.getVolumeItemService = getVolumeItemService;
const updateOwnerItem = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield getAllItemService({});
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const owners = item.owner;
        for (let j = 0; j < owners.length; j++) {
            const owner = owners[j];
            const balance = yield (0, aptos_services_1.getBalanceTokenForAccount)(owner, item.creator, item.collectionInfo.collectionName, item.itemName, item.chainId).then((balance) => balance).catch((err) => console.log(err));
            if (balance === "0") {
                owners.splice(j, 1);
                j--;
            }
        }
        yield (0, model_services_1.updateOneService)(item_model_1.default, { _id: item._id }, { owner: owners });
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(i);
    }
    console.log("Done");
});
const deletaItemNotOwner = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, model_services_1.deleteManyService)(item_model_1.default, { owner: [] });
});
const updateStatusItem = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, model_services_1.updateManyService)(item_model_1.default, { status: 1 }, { status: 0 });
});
const deleteItemNotCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield getAllItemService({});
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const collection = yield collection_model_1.default.findOne({ _id: item.collectionId });
        if (!collection) {
            yield (0, model_services_1.deleteOneService)(item_model_1.default, { _id: item._id });
        }
    }
    console.log("Done");
});
// deleteItemNotCollection();
// updateStatusItem();
// deletaItemNotOwner();
// updateOwnerItem();
