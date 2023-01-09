import express from "express";
import { createUserController } from "../controllers/user.controllers";
import {
	addUserToBlacklistController,
	getAllCollectionsController,
	getAllUserController,
	getItemsByCollectionIdController,
	importNFTForINOController,
	initBoxController,
	initCollectionController,
	removeUserToBlacklistController,
	setAdvertiseCollectionController,
	setAdvertiseNFTController,
	setConfirmCollectionController,
	uploadAdminController,
} from "../controllers/admin.controllers";
import { writeHotPotVideoController } from "../controllers/advertise.controller";
import { crawlTransactionOfUserController } from "../controllers/history.controllers";
import { checkCanSetAdvertiseMiddleware } from "../middlewares/checkAdvertise.middlewares";
import { checkCollectionExistMiddleware } from "../middlewares/checkCollection.middlewares";
import { checkItemExistMiddleware } from "../middlewares/checkItem.middleware";
import { checkSignatureValid, refreshSignature } from "../middlewares/checkSignature.middlewares";
import { checkAdminAddress } from "../middlewares/checkUser.middlewares";
import { checkChainIdMiddleware, checkPageIdMiddleware } from "../middlewares/checkOther.middlewares";
import { checkCreateINOMiddleware } from "../middlewares/ino.middleware";
import { createINOController, queryINOController } from "../controllers/ino.controller";
import {
	approveRequestController,
	getListRequestController,
	getRequestDetailController,
	pinRequestController,
} from "../controllers/manage.controller";
import { checkRequestINOExistMiddleware, deleteRequestMiddleware } from "../middlewares/manage.middlewares";

const adminRouter = express.Router();

/* ******************************************
 *				  POST ROUTE				*
 ********************************************/

adminRouter.post("/login", checkSignatureValid, checkAdminAddress, createUserController);
adminRouter.post("/refreshSignature", checkAdminAddress, refreshSignature, createUserController);

// Set confirm for a collection
adminRouter.post(
	"/setConfirm",
	checkSignatureValid,
	// checkAdminAddress,
	checkCollectionExistMiddleware,
	setConfirmCollectionController,
);

// Set advertise
adminRouter.post(
	"/collection/setAdvertise",
	checkSignatureValid,
	// checkAdminAddress,
	checkCollectionExistMiddleware,
	checkCanSetAdvertiseMiddleware,
	setAdvertiseCollectionController,
);

adminRouter.post(
	"/nft/setAdvertise",
	checkSignatureValid,
	// checkAdminAddress,
	checkItemExistMiddleware,
	setAdvertiseNFTController,
);

// set video in top in homepage
adminRouter.post("/hotpot/write", writeHotPotVideoController);

// blacklist manage
adminRouter.post("/blacklist/add", checkSignatureValid, checkAdminAddress, addUserToBlacklistController);

adminRouter.post("/blacklist/delete", checkSignatureValid, checkAdminAddress, removeUserToBlacklistController);

// Crawl user volume trade
adminRouter.post(
	"/userTrade",
	// checkSignatureValid,
	// checkAdminAddress,
	crawlTransactionOfUserController,
);

/// Upload file to storage
adminRouter.post("/upload", uploadAdminController);

// init when run server
adminRouter.post("/box/init", checkChainIdMiddleware, initBoxController);
adminRouter.post("/collection/init", checkChainIdMiddleware, initCollectionController);

//
adminRouter.get("/getAllUsers", getAllUserController);

adminRouter.get("/getAllCollections", getAllCollectionsController);

adminRouter.get("/items/collectionId/:collectionId", getItemsByCollectionIdController);

// INO ROUTE
adminRouter.post("/nft/import", checkChainIdMiddleware, importNFTForINOController);

adminRouter.post("/ino/create", checkChainIdMiddleware, checkCreateINOMiddleware, createINOController);

adminRouter.post("/ino/query/pageSize/:pageSize/page/:pageId", checkChainIdMiddleware, queryINOController);
/// REQUEST INO ROUTE
adminRouter.post(
	"/ino/request/list/pageSize/:pageSize/page/:pageId",
	deleteRequestMiddleware,
	checkPageIdMiddleware,
	getListRequestController,
);

adminRouter.get("/ino/request/detail/:requestId", checkRequestINOExistMiddleware, getRequestDetailController);

adminRouter.put("/ino/request/pin/:requestId", checkRequestINOExistMiddleware, pinRequestController);

adminRouter.put("/ino/request/approve/:requestId", checkRequestINOExistMiddleware, approveRequestController);

export default adminRouter;
