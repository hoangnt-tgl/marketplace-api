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
exports.getListItemInteractionController = exports.createInteractionController = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const interaction_model_1 = __importDefault(require("../models/interaction.model"));
const response_constants_1 = require("../constant/response.constants");
const model_services_1 = require("../services/model.services");
const item_services_1 = require("../services/item.services");
const createInteractionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress, chainId } = req.params;
        let { itemId, state } = req.body;
        userAddress = userAddress.toLowerCase();
        let itemExist = yield (0, model_services_1.queryExistService)(item_model_1.default, { _id: itemId });
        if (!itemExist)
            return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
        yield (0, model_services_1.deleteManyService)(interaction_model_1.default, { itemId, userAddress });
        if (state == true) {
            yield (0, model_services_1.createService)(interaction_model_1.default, { itemId, userAddress, state });
        }
        return res.status(200).json("Like item success");
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createInteractionController = createInteractionController;
const getListItemInteractionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userAddress } = req.params;
        let listInteract = yield (0, model_services_1.findManyService)(interaction_model_1.default, { userAddress, state: true });
        let listItem = [];
        yield Promise.all(listInteract.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const items = yield (0, item_services_1.getOneItemService)({ _id: item.itemId });
            if (items !== null) {
                listItem.push(items);
            }
        })));
        return res.status(200).json({ data: listItem });
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListItemInteractionController = getListItemInteractionController;
