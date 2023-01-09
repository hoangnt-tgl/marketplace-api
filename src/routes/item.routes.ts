import express from "express";
import {
	changePriceBetweenPairCoinController,
	createItemController,
	createItemDropController,
	deletePropertiesController,
	getMetadataController,
	getItemByIdController,
	getItemDetailController,
	getItemIdInPageController,
	getListItemsSellingController,
	getSearchItemByIdController,
	getSearchItemIdInPageController,
	importItemController,
	updateItemController,
	updatePropertiesController,
	uploadItemMediaController,
	uploadItemPreviewMediaController,
	freezeItemController,
	getBoxAssetController,
	getAssetBoxController,
	getBoxController,
	getItemByChainIdController,
	getStaticItemController,
	getListItemsHaveOfferingController,
	getItemIdInPageDropController,
	createItemDropController1
} from "../controllers/item.controllers";
import {
	checkCollectionExistMiddleware,
	checkCreatorCollectionMiddleware,
} from "../middlewares/checkCollection.middlewares";
import {
	checkItemCanCreateMiddleware,
	checkItemCanUpdateMiddleware,
	checkItemExistMiddleware,
} from "../middlewares/checkItem.middleware";
import {
	checkChainIdMiddleware,
	checkPageIdMiddleware,
	checkPriceTypeMiddleware,
} from "../middlewares/checkOther.middlewares";
import { checkSignatureValid } from "../middlewares/checkSignature.middlewares";
import { checkUserExistMiddleware, checkUserMatchOnBlockchain } from "../middlewares/checkUser.middlewares";

const itemRouter = express.Router();

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

// itemRouter.post("/box/unbox", checkItemExistMiddleware, checkChainIdMiddleware, unboxController);

itemRouter.post("/query/pageSize/:pageSize/page/:pageId", checkPageIdMiddleware, getItemIdInPageController);
itemRouter.post("/query1/pageSize/:pageSize/page/:pageId", checkPageIdMiddleware, getItemIdInPageDropController);

itemRouter.post("/boxes", checkChainIdMiddleware, getBoxController);

itemRouter.post("/boxes/asset", checkChainIdMiddleware, getAssetBoxController);

itemRouter.post(
	"/query-search/pageSize/:pageSize/page/:pageId",
	checkPageIdMiddleware,
	getSearchItemIdInPageController,
);

itemRouter.post("/changePrice", checkPriceTypeMiddleware, changePriceBetweenPairCoinController);

// itemRouter.get("/top-10-highest-price/category/:category", getTop10HighestPriceItemController);

itemRouter.post("/list-items-selling", checkChainIdMiddleware, getListItemsSellingController);

itemRouter.post("/import", checkChainIdMiddleware, checkUserExistMiddleware, importItemController);

itemRouter.post(
	"/create",
	checkChainIdMiddleware,
	checkSignatureValid,
	// checkUserMatchOnBlockchain,
	checkUserExistMiddleware,
	checkCollectionExistMiddleware,
	checkCreatorCollectionMiddleware,
	checkItemCanCreateMiddleware,
	createItemController,
);



itemRouter.post(
	"/drop",
	// checkChainIdMiddleware,
	// checkUserExistMiddleware,
	// checkCollectionExistMiddleware,
	createItemDropController,
);

itemRouter.post("/upload", uploadItemMediaController);

itemRouter.post("/uploadPreview", uploadItemPreviewMediaController);

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

itemRouter.post(
	"/boxAsset/pageSize/:pageSize/page/:pageId",
	checkChainIdMiddleware,
	checkPageIdMiddleware,
	getBoxAssetController,
);

itemRouter.get("/detail/itemId/:itemId", checkItemExistMiddleware, getItemDetailController);

itemRouter.get("/itemId/:itemId", getItemByIdController);

itemRouter.get("/search/itemId/:itemId", getSearchItemByIdController);

itemRouter.get("/list", checkChainIdMiddleware, checkUserExistMiddleware, getItemByChainIdController);

itemRouter.get("/static", getStaticItemController);

itemRouter.post("/getListItemsHaveOffering", getListItemsHaveOfferingController);

/* ******************************************
 *				PUT ROUTE					*
 ********************************************/
itemRouter.put(
	"/update/userAddress/:userAddress/itemId/:itemId",
	checkItemExistMiddleware,
	checkUserExistMiddleware,
	checkItemCanUpdateMiddleware,
	updateItemController,
);

itemRouter.get("/freeze/metadata/itemId/:itemId", checkItemExistMiddleware, getMetadataController);

itemRouter.put(
	"/freeze",
	checkItemExistMiddleware,
	checkUserExistMiddleware,
	checkItemCanUpdateMiddleware,
	freezeItemController,
);

itemRouter.put(
	"/update/properties/userAddress/:userAddress/itemId/:itemId",
	checkItemExistMiddleware,
	checkUserExistMiddleware,
	checkItemCanUpdateMiddleware,
	updatePropertiesController,
);

itemRouter.put(
	"/delete/properties/userAddress/:userAddress/itemId/:itemId",
	checkItemExistMiddleware,
	checkUserExistMiddleware,
	checkItemCanUpdateMiddleware,
	deletePropertiesController,
);

//Create new
itemRouter.post("/createItem", 
	// checkChainIdMiddleware,
	// checkSignatureValid,
	// checkUserMatchOnBlockchain,
	// checkUserExistMiddleware,
	// checkCollectionExistMiddleware,
	// checkCreatorCollectionMiddleware,
	// checkItemCanCreateMiddleware,	
	createItemDropController1
)

export default itemRouter;
