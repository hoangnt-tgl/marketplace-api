import express from "express";

import {
	getOrderQueryController,
	deleteOrderByItemIdController,
	getListToken,
	getOrderDetailController,
	getOrderByItemController,
	getOrderByItemIdAndOwnerController,
} from "../controllers/order.controller";

import { checkChainIdMiddleware } from "../middlewares/checkOther.middlewares";

import { checkOrderMiddleware } from "../middlewares/checkOrder.middlewares";
import { checkItemExistMiddleware } from "../middlewares/checkItem.middleware";
import { checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";

const orderRouter = express.Router();

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

//GET TOKEN LIST BY CHAINID
orderRouter.get("/listToken", getListToken);

//FILTER ORDER
orderRouter.post("/query", getOrderQueryController);

orderRouter.get("/detail/orderId/:orderId", checkOrderMiddleware, getOrderDetailController);

orderRouter.get("/itemId/:itemId", checkItemExistMiddleware, getOrderByItemController);

orderRouter.get(
	"/userAddress/:userAddress/itemId/:itemId/type/:type",
	checkItemExistMiddleware,
	checkUserExistMiddleware,
	getOrderByItemIdAndOwnerController,
);

//DELETE ORDER
orderRouter.post("/delete", checkOrderMiddleware, deleteOrderByItemIdController);

export default orderRouter;
