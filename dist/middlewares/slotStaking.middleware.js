"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQueryStakingMiddleware = void 0;
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
