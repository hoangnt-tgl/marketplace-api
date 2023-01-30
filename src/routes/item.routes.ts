import express from "express";

import { checkUserExist } from "../middlewares/checkUser.middlewares";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";
import { checkOwnerCollection } from "../middlewares/checkCollection.middlewares";

import { createItem, getItemById } from "../controllers/item.controllers";
const itemRouter = express.Router();

itemRouter.post(
	"/create/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	checkOwnerCollection,
	createItem,
);

itemRouter.get("/get-info/itemId/:itemId", getItemById);

export default itemRouter;
