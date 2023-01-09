"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuction_middlewares_1 = require("../middlewares/checkAuction.middlewares");
const item_controllers_1 = require("../controllers/item.controllers");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const itemRouter = express_1.default.Router();
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
itemRouter.post("/query/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, item_controllers_1.getItemIdInPageController);
//CHANGE PRICE ROUTE
itemRouter.post("/changePrice", checkOther_middlewares_1.checkPriceTypeMiddleware, item_controllers_1.changePriceBetweenPairCoinController);
//GET TOP 10 HIGHEST PRICE ITEM
// itemRouter.get("/top-10-highest-price/category/:category", getTop10HighestPriceItemController);
//GET LIST ITEM SELLING
itemRouter.post("/list-items-selling", checkOther_middlewares_1.checkChainIdMiddleware, item_controllers_1.getListItemsSellingController);
itemRouter.post("/create", checkOther_middlewares_1.checkChainIdMiddleware, checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionExistMiddleware, checkCollection_middlewares_1.checkCreatorCollectionMiddleware, checkItem_middleware_1.checkItemCanCreateMiddleware, item_controllers_1.createItemController);
itemRouter.post("/upload", item_controllers_1.uploadItemMediaController);
itemRouter.post("/uploadPreview", item_controllers_1.uploadItemPreviewMediaController);
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
itemRouter.get("/detail/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, item_controllers_1.getItemDetailController);
itemRouter.get("/itemId/:itemId", item_controllers_1.getItemByIdController);
/* ******************************************
 *				PUT ROUTE					*
 ********************************************/
itemRouter.put("/update/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.updateItemController);
itemRouter.put("/freeze/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, checkItem_middleware_1.checkItemMetaDataMiddleware, item_controllers_1.freezeItemController);
itemRouter.put("/update/properties/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.updatePropertiesController);
itemRouter.put("/update/attributes/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.updateAttributesController);
itemRouter.put("/delete/properties/userAddress/:userAddress/itemId/:itemId", checkItem_middleware_1.checkItemExistMiddleware, checkItem_middleware_1.checkItemCanUpdateMiddleware, item_controllers_1.deletePropertiesController);
/* ******************************************
 *				BOARC ROUTE					*
 ********************************************/
//Get by collection address and token id
itemRouter.get("/collectionId/:collectionId/itemTokenId/:itemTokenId", checkAuction_middlewares_1.updateAuctionStatusMiddleware, checkCollection_middlewares_1.checkCollectionExistMiddleware, item_controllers_1.getItemByCollectionAndTokenIdController);
itemRouter.get("/collectionId/:collectionId/pageSize/:pageSize/page/:pageId", checkCollection_middlewares_1.checkCollectionExistMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, item_controllers_1.getItemAuctionController);
itemRouter.get("/auction/itemId/:itemId", item_controllers_1.getItemByIdInAuctionController);
itemRouter.get("/auction/detail/itemId/:itemId", item_controllers_1.getItemDetailInAuctionController);
exports.default = itemRouter;
