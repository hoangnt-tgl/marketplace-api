import express from "express";

import { checkUserExist } from "../middlewares/checkUser.middlewares";
import {
	createCollection,
	getCollectionById,
	getCollectionByUserAddress,
	getCollectionByCategory,
	getAllCollection,
	getTopCollection,
} from "../controllers/collection.controllers";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";

const collectionRouter = express.Router();

collectionRouter.post(
	"/create/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
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

collectionRouter.get("/get-all/chainId/:chainId", getAllCollection);

collectionRouter.get("/get-info/collectionId/:collectionId", getCollectionById);

collectionRouter.post("/top/chainId/:chainId/pageSize/:pageSize/page/:pageId", getTopCollection);
export default collectionRouter;
