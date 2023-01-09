import express from "express";
import {
	getAdvertiseCollectionController,
	getAdvertiseNFTController,
	getHotpotVideoController,
} from "../controllers/advertise.controller";

const advertiseRouter = express.Router();

/* ******************************************
 *				  GET ROUTE				    *
 ********************************************/

advertiseRouter.get("/collection", getAdvertiseCollectionController);

advertiseRouter.get("/nft", getAdvertiseNFTController);

advertiseRouter.get("/hotpot", getHotpotVideoController);

export default advertiseRouter;
