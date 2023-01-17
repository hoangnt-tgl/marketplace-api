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
exports.getItemById = exports.createItem = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const response_constants_1 = require("../constant/response.constants");
const history_model_1 = __importDefault(require("../models/history.model"));
const model_services_1 = require("../services/model.services");
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { chainId, userAddress } = req.params;
        let newItem = req.body;
        newItem.creator = userAddress;
        newItem.chainId = chainId;
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
            type: 1,
            txHash: req.body.txHash,
        };
        (0, model_services_1.createService)(history_model_1.default, newHistory);
        return res.status(200).json({ data: itemInfo });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createItem = createItem;
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { itemId } = req.params;
        let itemInfo = yield (0, model_services_1.findOneService)(item_model_1.default, { _id: itemId });
        if (!itemInfo)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        return res.status(200).json({ data: itemInfo });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getItemById = getItemById;
