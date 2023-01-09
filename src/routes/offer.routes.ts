import express from "express";
import { checkChainIdMiddleware } from "../middlewares/checkOther.middlewares";
import {
	checkItemExistMiddleware,
	checkItemSelling,
	checkOwnerItemMiddleware,
} from "../middlewares/checkItem.middleware";
import { checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";
import {
	updateOfferController,
	getOfferByUserController,
	queryOfferController,
	getOfferDetailController,
	getOfferByItemController,
} from "../controllers/offer.controller";
import { checkOrderMiddleware } from "../middlewares/checkOrder.middlewares";

const offerRouter = express.Router();

/* ******************************************
 *				GET ROUTE					*
 ********************************************/
offerRouter.get("/user/orderId/:orderId", checkOrderMiddleware, getOfferByUserController);

offerRouter.get("/item/orderId/:orderId", checkOrderMiddleware, getOfferByItemController);

offerRouter.get("/detail/orderId/:orderId", checkOrderMiddleware, getOfferDetailController);

// offerRouter.get(
// 	"/userAddress/:userAddress/itemId/:itemId",
// 	checkUserExistMiddleware,
// 	checkItemExistMiddleware,
// 	queryOneOfferController,
// );

/* ******************************************
 *				POST ROUTE					*
 ********************************************/
offerRouter.post("/query", queryOfferController);

offerRouter.put(
	"/orderId/:orderId",
	checkChainIdMiddleware,
	checkOrderMiddleware,
	checkItemExistMiddleware,
	checkUserExistMiddleware,
	checkOwnerItemMiddleware,
	checkItemSelling,
	updateOfferController,
);

export default offerRouter;
