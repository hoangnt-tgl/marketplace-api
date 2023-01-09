import express from "express";
import {
	createCollectionController,
	getCollectionBoxController,
	getCategoryController,
	getCollectionByIdController,
	getCollectionByOwnerOrCreatorItemController,
	getCollectionCategoryController,
	getCollectionDetailController,
	getCollectionInfoController,
	getExtraInfoCollectionByIdController,
	getTopCollectionController,
	isCollectionNameExistController,
	queryCollectionIdsInPageController,
	querySearchCollectionIdsInPageController,
	updateCollectionController,
	uploadCollectionImageController,
	getListCollectionsByCategoryController,

	getListCollectionDroppController,
	getCollectionAndInfoController,
	// createCollectionInf,
	updateInfoController,
	getListCollectionDroppCustomController,
	updateTotalItemController,
	createCollectionAndInfoController,
} from "../controllers/collection.controllers";
import {
	checkCollectionCanCreateMiddleware,
	checkCollectionCanUpdateMiddleware,
	checkCollectionExistMiddleware,
	checkCollectionNameExistMiddleware,
} from "../middlewares/checkCollection.middlewares";
import { checkChainIdMiddleware, checkPageIdMiddleware } from "../middlewares/checkOther.middlewares";
import { checkUserExistMiddleware, checkUserMatchOnBlockchain } from "../middlewares/checkUser.middlewares";
import { checkSignatureValid } from "../middlewares/checkSignature.middlewares";


const collectionRouter = express.Router();

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

collectionRouter.get("/info/collectionId/:collectionId", checkCollectionExistMiddleware, getCollectionInfoController);

collectionRouter.get(
	"/collectionId/:collectionId",
	checkCollectionExistMiddleware,
	getExtraInfoCollectionByIdController,
);
collectionRouter.get("/search/collectionId/:collectionId", checkCollectionExistMiddleware, getCollectionByIdController);

collectionRouter.get("/topCategory", getCollectionCategoryController);
 
collectionRouter.get("/category/:typeCategory", getCollectionCategoryController);

collectionRouter.get(
	"/detail/collectionId/:collectionId",
	checkCollectionExistMiddleware,
	getCollectionDetailController,
);

collectionRouter.get("/category/:typeCategory/pageSize/:pageSize/page/:pageId", getListCollectionsByCategoryController);

collectionRouter.get("/category", getCategoryController);




/* ******************************************
 *				POST ROUTE					*
 ********************************************/

collectionRouter.post("/box/pageSize/:pageSize/page/:pageId", checkPageIdMiddleware, getCollectionBoxController);

collectionRouter.post("/top/pageSize/:pageSize/page/:pageId", checkPageIdMiddleware, getTopCollectionController);

collectionRouter.post(
	"/collectible-asset/pageSize/:pageSize/page/:pageId",
	checkUserExistMiddleware,
	getCollectionByOwnerOrCreatorItemController,
);

collectionRouter.post(
	"/query/pageSize/:pageSize/page/:pageId",
	checkPageIdMiddleware,
	queryCollectionIdsInPageController,
);

collectionRouter.post(
	"/query-search/pageSize/:pageSize/page/:pageId",
	checkPageIdMiddleware,
	querySearchCollectionIdsInPageController,
);

collectionRouter.post("/upload", uploadCollectionImageController);

// collectionRouter.post(
// 	"/create",
// 	checkUserMatchOnBlockchain,
// 	checkChainIdMiddleware,
// 	checkSignatureValid,
// 	checkUserExistMiddleware,
// 	checkCollectionCanCreateMiddleware,
// 	createCollectionController,
// );
collectionRouter.post(
	"/create",
	// checkUserMatchOnBlockchain,
	checkChainIdMiddleware,
	checkSignatureValid,
	checkUserExistMiddleware,
	checkCollectionCanCreateMiddleware,
	createCollectionController,
);
collectionRouter.post("/checkName", checkChainIdMiddleware, isCollectionNameExistController);

/* ******************************************
 *				PUT ROUTE					*
 ********************************************/

collectionRouter.put(
	"/collectionId/:collectionId",
	checkCollectionExistMiddleware,
	checkUserExistMiddleware,
	checkCollectionNameExistMiddleware,
	checkCollectionCanUpdateMiddleware,
	updateCollectionController,
);

/*---------Add Get Route Collection------------*/
collectionRouter.get("/list", getListCollectionDroppController)
collectionRouter.get("/info/:collectionId", getCollectionAndInfoController)
collectionRouter.get("/list1/:chainId", getListCollectionDroppCustomController)

/*---------Add Post Route Collection------------*/
// collectionRouter.post("/createinfo",
// 	checkUserMatchOnBlockchain,
// 	checkChainIdMiddleware,
// 	checkSignatureValid,
// 	checkUserExistMiddleware,
// 	checkCollectionCanCreateMiddleware,
// 	createCollectionInf)
collectionRouter.post("/createcollection",
	// checkUserMatchOnBlockchain,
	checkChainIdMiddleware,
	// checkSignatureValid,
	// checkUserExistMiddleware,
	checkCollectionCanCreateMiddleware,
	createCollectionAndInfoController
)

/*---------Add Put Route Collection------------*/
collectionRouter.put("/update",updateInfoController)
collectionRouter.put("/finallyDrop", )
collectionRouter.put("/updateTotalItem", updateTotalItemController)


export default collectionRouter;

