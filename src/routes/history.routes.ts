import express from "express";
import { checkHistoryExistMiddleware, checkItemExistMiddleware } from "../middlewares/checkItem.middleware";
import {
	getHistoryByItemInPageController,
	getListHistoriesByUserAddressController,
	getCollectionActivityController,
	getItemPriceChartDataController,
	getHistoryDetailController,
} from "../controllers/history.controllers";
import { checkPageIdMiddleware } from "../middlewares/checkOther.middlewares";
import { checkCollectionExistMiddleware } from "../middlewares/checkCollection.middlewares";
import { checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";

const historyRouter = express.Router();

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

historyRouter.post(
	"/itemId/:itemId/pageSize/:pageSize/page/:pageId",
	checkItemExistMiddleware,
	checkPageIdMiddleware,
	getHistoryByItemInPageController,
);

historyRouter.post(
	"/userAddress/:userAddress/pageSize/:pageSize/page/:pageId",
	checkUserExistMiddleware,
	checkPageIdMiddleware,
	getListHistoriesByUserAddressController,
);

historyRouter.post(
	"/collectionId/:collectionId/pageSize/:pageSize/page/:pageId",
	checkCollectionExistMiddleware,
	checkPageIdMiddleware,
	getCollectionActivityController,
);

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

historyRouter.get("/chart/itemId/:itemId", checkItemExistMiddleware, getItemPriceChartDataController);

historyRouter.get("/detail/id/:historyId", checkHistoryExistMiddleware, getHistoryDetailController);

export default historyRouter;
