import express from "express";

import { checkUserAuthen, checkUserExist } from "../middlewares/checkUser.middlewares";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";
import { checkOwnerCollection } from "../middlewares/checkCollection.middlewares";
import { checkItemName, checkItemDescription, checkItemMedia } from "../middlewares/checkItem.middlewares";

import {
	createItem,
	getItemById,
	getAllItem,
	getItemForUser,
	showSelectItemController,
	showRandomListItemController,
	getListItemByCreatedController,
	getListItemByOwnerController,
	getTranController,
	setItemController,
	getItemController,
} from "../controllers/item.controllers";

const itemRouter = express.Router();

itemRouter.post(
	"/create/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	checkOwnerCollection,
	checkUserAuthen,
	checkItemName,
	checkItemDescription,
	checkItemMedia,
	createItem,
);
itemRouter.get("/get-info/itemId/:itemId", getItemById);
itemRouter.get("/get-all/chainId/:chainId", checkChainIdValid, getAllItem);
itemRouter.get(
	"/get-item-for-user/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	getItemForUser,
);

itemRouter.post("/show-list-item", showSelectItemController);
itemRouter.get("/show-random-list-item", showRandomListItemController);
itemRouter.get("/get-item-by-created/:userAddress", getListItemByCreatedController);
itemRouter.get("/get-item-by-collected/:userAddress", getListItemByOwnerController);
itemRouter.get("/get-transaction", getTranController);
itemRouter.post("/setItem", setItemController);
itemRouter.get("/getItem",	getItemController);

export default itemRouter;
