import express from "express";

import { checkUserExist } from "../middlewares/checkUser.middlewares";
import {
	createCollection,
	getCollectionById,
	getCollectionByUserAddress,
	getCollectionByCategory,
	getAllCollection,
} from "../controllers/collection.controllers";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";
import { sellItem, buyItem, cancelOrder, getOrderSellItem } from "../controllers/order.controllers";
const orderRouter = express.Router();

orderRouter.post("/sell-item/userAddress/:userAddress/chainId/:chainId", checkUserExist, checkChainIdValid, sellItem);
orderRouter.post("/buy-item/userAddress/:userAddress/chainId/:chainId", checkUserExist, checkChainIdValid, buyItem);
orderRouter.post(
	"/cancel-order/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	cancelOrder,
);

orderRouter.get("/get-order-sell", getOrderSellItem);

export default orderRouter;
