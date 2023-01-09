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
exports.getManyInteractionService = exports.checkUserIsLikeItemService = exports.getInteractionByStateService = exports.getInteractionsOfItemService = exports.createInteractionService = void 0;
const interaction_model_1 = __importDefault(require("../models/interaction.model"));
const model_services_1 = require("./model.services");
const createInteractionService = (userAddress, itemId, state) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield checkInteractionsExist(userAddress, itemId);
    if (!check) {
        const newInteractions = yield (0, model_services_1.createService)(interaction_model_1.default, {
            userAddress,
            itemId: (0, model_services_1.createObjIdService)(itemId),
            state,
        });
        return newInteractions;
    }
    const interaction = yield (0, model_services_1.updateOneService)(interaction_model_1.default, {
        userAddress,
        itemId: (0, model_services_1.createObjIdService)(itemId),
    }, {
        state,
    });
    return interaction;
});
exports.createInteractionService = createInteractionService;
const checkUserIsLikeItemService = (userAddress = undefined, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userAddress) {
        const interaction = yield (0, model_services_1.findOneService)(interaction_model_1.default, { userAddress, itemId: (0, model_services_1.createObjIdService)(itemId) }, "state");
        if (interaction) {
            return { isLike: interaction.state };
        }
    }
    return { isLike: false };
});
exports.checkUserIsLikeItemService = checkUserIsLikeItemService;
const getInteractionsOfItemService = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = yield (0, model_services_1.findManyService)(interaction_model_1.default, { itemId: (0, model_services_1.createObjIdService)(itemId), state: true }, "_id");
    return { itemInteraction: amount.length };
});
exports.getInteractionsOfItemService = getInteractionsOfItemService;
const getManyInteractionService = (objQuery, properties = "") => __awaiter(void 0, void 0, void 0, function* () {
    const interactions = yield (0, model_services_1.findManyService)(interaction_model_1.default, objQuery, properties);
    return interactions;
});
exports.getManyInteractionService = getManyInteractionService;
const checkInteractionsExist = (userAddress, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(interaction_model_1.default, { userAddress, itemId: (0, model_services_1.createObjIdService)(itemId) });
});
const getInteractionByStateService = (userAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const listInteractions = yield getManyInteractionService({ userAddress, state: true }, "itemId");
    return listInteractions;
});
exports.getInteractionByStateService = getInteractionByStateService;
