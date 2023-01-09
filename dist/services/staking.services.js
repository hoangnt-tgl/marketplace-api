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
exports.getTotalStakingInfoService = exports.checkSlotExistService = exports.querySlotStakingService = void 0;
const slotStaking_model_1 = __importDefault(require("../models/slotStaking.model"));
const collection_services_1 = require("./collection.services");
const item_services_1 = require("./item.services");
const model_services_1 = require("./model.services");
const other_services_1 = require("./other.services");
const checkSlotExistService = (slotId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, model_services_1.queryExistService)(slotStaking_model_1.default, { _id: (0, model_services_1.createObjIdService)(slotId) });
});
exports.checkSlotExistService = checkSlotExistService;
const getOneSlotStakingService = (objQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield slotStaking_model_1.default
        .findOne(objQuery)
        .lean()
        .populate({ path: "itemInfo", select: "itemTokenId itemName itemMedia" })
        .populate({ path: "ticketInfo", select: "itemTokenId itemName itemMedia" });
    return slot;
});
const querySlotStakingService = (userAddress, stateStaking, option, itemType, chainId, pageId, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const stateObj = stateStaking === "isStaking"
        ? {
            isHarvest: false,
            reward: { $gt: 0 },
        }
        : stateStaking === "isHarvest"
            ? {
                isHarvest: true,
            }
            : stateStaking === "cancel"
                ? {
                    isHarvest: false,
                    reward: 0,
                }
                : {};
    const queryObj = (0, other_services_1.removeUndefinedOfObj)(Object.assign(Object.assign({}, stateObj), { chainId: chainId ? chainId : undefined, option,
        itemType,
        userAddress }));
    const totalItems = yield slotStaking_model_1.default.countDocuments(queryObj);
    const totalPages = Math.ceil(totalItems / pageSize);
    const slots = yield slotStaking_model_1.default
        .find(queryObj)
        .sort({ createdAt: -1 })
        .lean()
        .populate({ path: "itemInfo", select: "itemTokenId itemName itemMedia" })
        .populate({ path: "ticketInfo", select: "itemTokenId itemName itemMedia" })
        .skip(pageSize * (pageId - 1))
        .limit(pageSize);
    const amountItems = slots.reduce((amount, cur) => {
        amount += cur.itemAmount;
        return amount;
    }, 0);
    return {
        data: slots,
        pagination: {
            totalItems,
            pageSize,
            currentPage: pageId,
            totalPages,
        },
        amountItems,
    };
});
exports.querySlotStakingService = querySlotStakingService;
const getTotalStakingInfoService = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const slots = yield slotStaking_model_1.default.find({ chainId }).populate({ path: "itemInfo" }).lean();
    const collectionAsset = yield (0, collection_services_1.getCollectionAssetERC1155Service)(chainId);
    const items = yield (0, item_services_1.getManyItemService)({ collectionId: collectionAsset._id });
    const totalSlots = [];
    items.map((item) => {
        totalSlots.push({
            itemName: item.itemName,
            totalNST: 0,
            totalTicketCard: 0,
            totalStake: 0,
        });
    });
    const participants = [];
    slots.map((slot) => {
        if (!participants.includes(slot.userAddress)) {
            participants.push(slot.userAddress);
        }
        const index = items.findIndex(item => item.itemName === slot.itemInfo.itemName);
        totalSlots[index].totalNST;
        totalSlots[index].totalNST += slot.reward;
        totalSlots[index].totalTicketCard += slot.ticketCardAmount;
        totalSlots[index].totalStake += 1;
    });
    return {
        totalParticipants: participants.length,
        totalSlots,
    };
});
exports.getTotalStakingInfoService = getTotalStakingInfoService;
