import express from "express";
import { checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";
import { getTotalStakingInfoController, queryStakingController } from "../controllers/staking.controller";
import { checkQueryStakingMiddleware } from "../middlewares/slotStaking.middleware";
import { checkChainIdMiddleware } from "../middlewares/checkOther.middlewares";

const stakingRouter = express.Router();

stakingRouter.post(
	"/query-staking/pageSize/:pageSize/page/:pageId",
	checkUserExistMiddleware,
	checkQueryStakingMiddleware,
	queryStakingController,
);

stakingRouter.get("/totalInfo/chainId/:chainId", checkChainIdMiddleware, getTotalStakingInfoController);

export default stakingRouter;
