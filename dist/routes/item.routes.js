"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_controllers_1 = require("../controllers/item.controllers");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const itemRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
// itemRouter.post("/box/unbox", checkItemExistMiddleware, checkChainIdMiddleware, unboxController);
itemRouter.post("/query/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, item_controllers_1.getItemIdInPageController);
itemRouter.post("/query1/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, item_controllers_1.getItemIdInPageController1);
itemRouter.post("/boxes", checkOther_middlewares_1.checkChainIdMiddleware, item_controllers_1.getBoxController);
itemRouter.post("/boxes/asset", checkOther_middlewares_1.checkChainIdMiddleware, item_controllers_1.getAssetBoxController);
itemRouter.post("/query-search/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, item_controllers_1.getSearchItemIdInPageController);
itemRouter.post("/changePrice", checkOther_middlewares_1.checkPriceTypeMiddleware, item_controllers_1.changePriceBetweenPairCoinController);
// itemRouter.get("/top-10-highest-price/category/:category", getTop10HighestPriceItemController);
itemRouter.post("/list-items-selling", checkOther_middlewares_1.checkChainIdMiddleware, item_controllers_1.getListItemsSellingController);
itemRouter.post("/import", checkOther_middlewares_1.checkChainIdMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, item_controllers_1.importItemController);
itemRouter.post("/create", checkOther_middlewares_1.checkChainIdMiddleware, checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionExistMiddleware, checkCollection_middlewares_1.checkCreatorCollectionMiddleware, checkItem_middleware_1.checkItemCanCreateMiddleware, item_controllers_1.createItemController);
itemRouter.post("/drop", 
// checkChainIdMiddleware,
// checkUserExistMiddleware,
// checkCollectionExistMiddleware,
item_controllers_1.createItemDropController);
itemRouter.post("/upload", item_controllers_1.uploadItemMediaController);
itemRouter.post("/uploadPreview", item_controllers_1.uploadItemPreviewMediaController);
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
itemRouter.post("/boxAsset/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkChainIdMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, item_controllers_1.getBoxAssetController);
itemRouter.get("/detail/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, item_controllers_1.getItemDetailController);
itemRouter.get("/itemId/:itemId", item_controllers_1.getItemByIdController);
itemRouter.get("/search/itemId/:itemId", item_controllers_1.getSearchItemByIdController);
itemRouter.get("/list", checkOther_middlewares_1.checkChainIdMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, item_controllers_1.getItemByChainIdController);
itemRouter.get("/static", item_controllers_1.getStaticItemController);
itemRouter.post("/getListItemsHaveOffering", item_controllers_1.getListItemsHaveOfferingController);
/* ******************************************
 *				PUT ROUTE					*
 ********************************************/
itemRouter.put("/update/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.updateItemController);
itemRouter.get("/freeze/metadata/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, item_controllers_1.getMetadataController);
itemRouter.put("/freeze", checkItem_middleware_1.checkItemExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.freezeItemController);
itemRouter.put("/update/properties/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.updatePropertiesController);
itemRouter.put("/delete/properties/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.deletePropertiesController);
//Create new
// itemRouter.post("/createItem", 
// 	checkChainIdMiddleware,
// 	checkSignatureValid,
// 	checkUserMatchOnBlockchain,
// 	checkUserExistMiddleware,
// 	checkCollectionExistMiddleware,
// 	checkCreatorCollectionMiddleware,
// 	checkItemCanCreateMiddleware,	
// 	createItemDropController1
// )
exports.default = itemRouter;
