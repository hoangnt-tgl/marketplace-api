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
exports.getItemForUser = exports.getAllItem = exports.getItemById = exports.createItem = exports.getVolumeAllItemController = exports.updateOwnerController = exports.getItemController = exports.setItemController = exports.getTranController = exports.getListItemByOwnerController = exports.getListItemByCreatedController = exports.showRandomListItemController = exports.showSelectItemController = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const response_constants_1 = require("../constant/response.constants");
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("../services/model.services");
const item_services_1 = require("../services/item.services");
const fs_1 = __importDefault(require("fs"));
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chainId, userAddress } = req.params;
        let newItem = req.body;
        newItem.creator = userAddress;
        newItem.chainId = chainId;
        newItem.owner = [userAddress];
        const existItem = yield (0, model_services_1.queryExistService)(item_model_1.default, {
            collectionId: newItem.collectionId,
            itemName: newItem.itemName,
        });
        if (existItem)
            return res.status(403).json({ error: response_constants_1.ERROR_RESPONSE[403] });
        let itemInfo = yield (0, model_services_1.createService)(item_model_1.default, newItem);
        let newHistory = {
            collectionId: newItem.collectionId,
            itemId: itemInfo._id,
            from: userAddress,
            to: req.body.to,
            quantity: newItem.amount,
            type: 1,
            txHash: req.body.txHash,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        return res.status(200).json({ data: itemInfo });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot Create Item" });
    }
});
exports.createItem = createItem;
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { itemId } = req.params;
        let itemInfo = yield (0, item_services_1.getOneItemService)({ _id: itemId });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        return res.status(200).json({ data: itemInfo });
    }
    catch (error) {
        return res.status(500).json({ error: "Cannot get Item" });
    }
});
exports.getItemById = getItemById;
const getAllItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chainId } = req.params;
        let listItem = yield (0, item_services_1.getAllItemService)({ chainId });
        return res.status(200).json({ data: listItem });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getAllItem = getAllItem;
const getItemForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chainId, userAddress } = req.params;
        let listItem = yield (0, item_services_1.getAllItemService)({ chainId, owner: { $all: userAddress } });
        return res.status(200).json({ data: listItem });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemForUser = getItemForUser;
const showSelectItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = req.body.listitem;
        const listItem = yield (0, item_services_1.getListSelectItemService)(list);
        return res.status(200).json({ data: listItem });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.showSelectItemController = showSelectItemController;
const showRandomListItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listItem = yield (0, item_services_1.getListRandomItemService)();
        return res.status(200).json({ data: listItem });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.showRandomListItemController = showRandomListItemController;
const getListItemByCreatedController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAddress = req.params.userAddress;
        const result = yield (0, item_services_1.getListItemByCreatedService)(userAddress);
        return res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListItemByCreatedController = getListItemByCreatedController;
const getListItemByOwnerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAddress = req.params.userAddress;
        const result = yield (0, item_services_1.getListItemByOwnerService)(userAddress);
        return res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListItemByOwnerController = getListItemByOwnerController;
const getTranController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, item_services_1.getTransactionService)();
        return res.status(200).json({ result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getTranController = getTranController;
const setItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listItemId = req.body.listItemId;
        // fs.writeFileSync("./public/listItemId.json", JSON.stringify(listItemId));
        fs_1.default.writeFile("./public/listItemId.json", JSON.stringify(listItemId), "utf8", () => {
            console.log(`Update lits item successfully at ${new Date(Date.now())}`);
        });
        return res.status(200).json({ result: "success" });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.setItemController = setItemController;
const getItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listItemId = JSON.parse(fs_1.default.readFileSync("./public/listItemId.json", "utf8"));
        const listItem = yield (0, item_services_1.getListSelectItemService)(listItemId);
        return res.status(200).json({ data: listItem });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemController = getItemController;
const updateOwnerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, send, receive, quantity, txHash } = req.body;
        const result = yield (0, item_services_1.updateItemService)(itemId, send, receive, quantity, txHash);
        return res.status(200).json({ data: result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.updateOwnerController = updateOwnerController;
const getVolumeAllItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const result = yield (0, item_services_1.getVolumeItemService)(id);
        res.status(200).json({ data: result });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getVolumeAllItemController = getVolumeAllItemController;
