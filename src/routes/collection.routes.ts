import express from "express";

import { checkUserAuthen, checkUserExist } from "../middlewares/checkUser.middlewares";
import {
	createCollection,
	getCollectionById,
	getCollectionByUserAddress,
	getCollectionByCategory,
	getAllCollection,
	getTopCollection,
	getNewCollectionController,
	getAllCollectionByCategory,
	getVolumeTradeCollectionController,
} from "../controllers/collection.controllers";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";
import { checkCollectionName } from "../middlewares/checkCollection.middlewares";
import { checkCollectionDescription } from "../middlewares/checkCollection.middlewares";

const collectionRouter = express.Router();

collectionRouter.post(
	"/create/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	checkUserAuthen,
	checkCollectionName,
	checkCollectionDescription,
	createCollection,
);

// get collection of one user
collectionRouter.get(
	"/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	getCollectionByUserAddress,
);

collectionRouter.get("/category/:category/chainId/:chainId", getCollectionByCategory);

collectionRouter.get("/category/chainId/:chainId", getAllCollectionByCategory);

collectionRouter.get("/get-all/chainId/:chainId", getAllCollection);

collectionRouter.get("/get-info/collectionId/:collectionId", getCollectionById);

collectionRouter.get("/get-new-created-collection", getNewCollectionController);

collectionRouter.post("/top/chainId/:chainId/pageSize/:pageSize/page/:pageId", getTopCollection);

collectionRouter.get("/get-volume-collection/:id", getVolumeTradeCollectionController);

export default collectionRouter;
