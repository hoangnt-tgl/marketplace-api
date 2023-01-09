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
exports.checkSlotStakingExistMiddleware = exports.checkQueryStakingMiddleware = void 0;
const staking_services_1 = require("../services/staking.services");
const item_constant_1 = require("../constant/item.constant");
const response_constants_1 = require("../constant/response.constants");
const checkQueryStakingMiddleware = (req, res, next) => {
    const { stateStaking, itemType, option } = req.body;
    if (itemType && !Object.keys(item_constant_1.NCA_TYPE).includes(itemType.toString())) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    if (option && !Object.keys(item_constant_1.STAKING_OPTION).includes(option.toString())) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    if (stateStaking && !["isHarvest", "isStaking", "cancel"].includes(stateStaking)) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    return next();
};
exports.checkQueryStakingMiddleware = checkQueryStakingMiddleware;
const checkSlotStakingExistMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slotId = req.params.slotId;
    if (!slotId) {
        return res.status(400).json({ error: response_constants_1.ERROR_RESPONSE[400] });
    }
    try {
        const check = yield (0, staking_services_1.checkSlotExistService)(slotId);
        if (check) {
            return next();
        }
        return res.status(404).json({ error: response_constants_1.ERROR_RESPONSE[404] });
    }
    catch (error) { }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.checkSlotStakingExistMiddleware = checkSlotStakingExistMiddleware;
