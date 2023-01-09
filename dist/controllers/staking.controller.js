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
exports.getTotalStakingInfoController = exports.queryStakingController = void 0;
const response_constants_1 = require("../constant/response.constants");
const staking_services_1 = require("../services/staking.services");
const queryStakingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress, stateStaking, itemType, option, chainId } = req.body;
    const { pageSize, pageId } = req.params;
    try {
        const dataQuery = yield (0, staking_services_1.querySlotStakingService)(userAddress, stateStaking, option, itemType, chainId, Number(pageId), Number(pageSize));
        return res.status(200).json(dataQuery);
    }
    catch (error) {
        console.log(error.message);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.queryStakingController = queryStakingController;
const getTotalStakingInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = req.params.chainId;
    try {
        const info = yield (0, staking_services_1.getTotalStakingInfoService)(chainId);
        return res.status(200).json({ data: info });
    }
    catch (error) {
        console.log(error);
    }
    return res.status(500).json({ error: response_constants_1.ERROR_RESPONSE[500] });
});
exports.getTotalStakingInfoController = getTotalStakingInfoController;
