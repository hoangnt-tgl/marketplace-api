import express from "express";

import { checkUserExist } from "../middlewares/checkUser.middlewares";
import { createCollection, getCollectionById } from "../controllers/collection.controllers";
import { checkChainIdValid } from "../middlewares/checkOther.middlewares";

const collectionRouter = express.Router();

collectionRouter.post(
	"/create/userAddress/:userAddress/chainId/:chainId",
	checkUserExist,
	checkChainIdValid,
	createCollection,
);

collectionRouter.get("/get-info/collectionId/:collectionId", getCollectionById);


export default collectionRouter;
