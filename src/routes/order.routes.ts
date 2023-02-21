import express from "express";

import { checkUserAuthen, checkUserExist } from "../middlewares/checkUser.middlewares";
import {
	createCollection,
	getCollectionById,
	getCollectionByUserAddress,
	getCollectionByCategory,
	getAllCollection,
} from "../controllers/collection.controllers";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";
import { 
	sellItem, 
	buyItem, 
	cancelOrder, 
	getOrderSellItem, 
	createOrderController, 
	getOrderByIdController,
	deleteOrderController,
	getOrderByItemIdController,
	getOrderByInstantSaleTrueController,
	getOrderByInstantSaleFalseController,
} from "../controllers/order.controllers";
const orderRouter = express.Router();

orderRouter.post(
	"/sell-item/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	checkUserAuthen,
	sellItem,
);
orderRouter.post(
	"/buy-item/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	checkUserAuthen,
	buyItem,
);
orderRouter.post(
	"/cancel-order/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	checkUserAuthen,
	cancelOrder,
);

orderRouter.get("/get-order-sell", getOrderSellItem);
orderRouter.post("/create-order", createOrderController);
orderRouter.get("/get-order-by-id/:orderId", getOrderByIdController);
orderRouter.delete("/delete-order/:orderId", deleteOrderController);

orderRouter.get("/get-order-by-itemId/:itemId", getOrderByItemIdController);
orderRouter.get("/get-order-by-instantSale-true", getOrderByInstantSaleTrueController);
orderRouter.get("/get-order-by-instantSale-false", getOrderByInstantSaleFalseController);

export default orderRouter;
