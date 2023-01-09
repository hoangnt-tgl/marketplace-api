import express from "express";
import {
	checkAuctionExistMiddleware,
	checkCreateAuctionMiddleware,
	checkListItemAuctionMiddleware,
	updateAuctionStatusMiddleware,
} from "../middlewares/checkAuction.middlewares";
import {
	createAuctionController,
	settleAuctionController,
	makeBidController,
	getAuctionByIdController,
	queryAuctionController,
	getTopBidController,
	getListBidderController,
	auctionParticipateController,
} from "../controllers/auction.controllers";
import { checkPageIdMiddleware } from "../middlewares/checkOther.middlewares";
import { checkINOExistMiddleware } from "../middlewares/ino.middleware";
import { checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";
const auctionRouter = express.Router();

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

auctionRouter.get(
	"/auctionId/:auctionId",
	updateAuctionStatusMiddleware,
	checkAuctionExistMiddleware,
	getAuctionByIdController,
);

auctionRouter.get("/top/limit/:limit", updateAuctionStatusMiddleware, getTopBidController);

auctionRouter.get("/bidder/auctionId/:auctionId", checkAuctionExistMiddleware, getListBidderController);

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

auctionRouter.post(
	"/create",
	//checkINOExistMiddleware,
	checkListItemAuctionMiddleware,
	//checkCreateAuctionMiddleware,
	createAuctionController,
);

auctionRouter.post(
	"/settle/auctionId/:auctionId",
	checkAuctionExistMiddleware,
	checkUserExistMiddleware,
	settleAuctionController
);

auctionRouter.post(
	"/bid/auctionId/:auctionId",
	checkAuctionExistMiddleware,
	checkUserExistMiddleware,
	makeBidController,
);

auctionRouter.post(
	"/pageSize/:pageSize/page/:pageId",
	updateAuctionStatusMiddleware,
	checkPageIdMiddleware,
	queryAuctionController,
);

auctionRouter.post("/participate", checkAuctionExistMiddleware, checkUserExistMiddleware, auctionParticipateController);

export default auctionRouter;
