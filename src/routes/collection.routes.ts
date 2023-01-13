import express from "express";

import { checkUserExist } from "../middlewares/checkUser.middlewares";
import { createCollection, getCollectionById, getCollectionByUserAddress } from "../controllers/collection.controllers";
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

export default collectionRouter;
