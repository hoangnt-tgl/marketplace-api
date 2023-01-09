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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserIsLikeItemController = exports.getListInteractionsController = exports.createInteractionController = void 0;
const interactions_services_1 = require("../services/interactions.services");
const response_constants_1 = require("../constant/response.constants");
const createInteractionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, itemId, state } = req.body;
    try {
        const interaction = yield (0, interactions_services_1.createInteractionService)(userAddress, itemId, state);
        return res.status(200).json(interaction);
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.createInteractionController = createInteractionController;
const getListInteractionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAddress = req.params.userAddress;
        const listInteractions = yield (0, interactions_services_1.getInteractionByUserService)(userAddress);
        if (listInteractions) {
            return res.status(200).json({ data: listInteractions });
        }
        else {
            return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[500] });
        }
    }
    catch (error) {
        return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
    }
});
exports.getListInteractionsController = getListInteractionsController;
const checkUserIsLikeItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.itemId;
    const userAddress = req.params.userAddress;
    try {
        const result = yield (0, interactions_services_1.checkUserIsLikeItemService)(userAddress, itemId);
        return res.status(200).json({ data: result });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkUserIsLikeItemController = checkUserIsLikeItemController;
