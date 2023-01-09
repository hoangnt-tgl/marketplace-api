"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const staking_controller_1 = require("../controllers/staking.controller");
const slotStaking_middleware_1 = require("../middlewares/slotStaking.middleware");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const stakingRouter = express_1.default.Router();
stakingRouter.post("/query-staking/pageSize/:pageSize/page/:pageId", checkUser_middlewares_1.checkUserExistMiddleware, slotStaking_middleware_1.checkQueryStakingMiddleware, staking_controller_1.queryStakingController);
stakingRouter.get("/totalInfo/chainId/:chainId", checkOther_middlewares_1.checkChainIdMiddleware, staking_controller_1.getTotalStakingInfoController);
exports.default = stakingRouter;
