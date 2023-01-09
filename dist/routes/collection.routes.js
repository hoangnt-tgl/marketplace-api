"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collection_controllers_1 = require("../controllers/collection.controllers");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const collectionRouter = express_1.default.Router();
/* ******************************************
 *				GET ROUTE					*
 ********************************************/
collectionRouter.get("/info/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, collection_controllers_1.getCollectionInfoController);
collectionRouter.get("/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, collection_controllers_1.getExtraInfoCollectionByIdController);
collectionRouter.get("/search/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, collection_controllers_1.getCollectionByIdController);
collectionRouter.get("/topCategory", collection_controllers_1.getCollectionCategoryController);
collectionRouter.get("/category/:typeCategory", collection_controllers_1.getCollectionCategoryController);
collectionRouter.get("/detail/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, collection_controllers_1.getCollectionDetailController);
collectionRouter.get("/category/:typeCategory/pageSize/:pageSize/page/:pageId", collection_controllers_1.getListCollectionsByCategoryController);
collectionRouter.get("/category", collection_controllers_1.getCategoryController);
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
collectionRouter.post("/box/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, collection_controllers_1.getCollectionBoxController);
collectionRouter.post("/top/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, collection_controllers_1.getTopCollectionController);
collectionRouter.post("/collectible-asset/pageSize/:pageSize/page/:pageId", checkUser_middlewares_1.checkUserExistMiddleware, collection_controllers_1.getCollectionByOwnerOrCreatorItemController);
collectionRouter.post("/query/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, collection_controllers_1.queryCollectionIdsInPageController);
collectionRouter.post("/query-search/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, collection_controllers_1.querySearchCollectionIdsInPageController);
collectionRouter.post("/upload", collection_controllers_1.uploadCollectionImageController);
// collectionRouter.post(
// 	"/create",
// 	checkUserMatchOnBlockchain,
// 	checkChainIdMiddleware,
// 	checkSignatureValid,
// 	checkUserExistMiddleware,
// 	checkCollectionCanCreateMiddleware,
// 	createCollectionController,
// );
collectionRouter.post("/create", checkUser_middlewares_1.checkUserMatchOnBlockchain, checkOther_middlewares_1.checkChainIdMiddleware, checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionCanCreateMiddleware, collection_controllers_1.createCollectionController);
collectionRouter.post("/checkName", checkOther_middlewares_1.checkChainIdMiddleware, collection_controllers_1.isCollectionNameExistController);
/* ******************************************
 *				PUT ROUTE					*
 ********************************************/
collectionRouter.put("/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionNameExistMiddleware, checkCollection_middlewares_1.checkCollectionCanUpdateMiddleware, collection_controllers_1.updateCollectionController);
/*---------Add Get Route Collection------------*/
collectionRouter.get("/list", collection_controllers_1.getListCollectionDropp);
collectionRouter.get("/info/:collectionId", collection_controllers_1.getCollectionIdInfo);
collectionRouter.get("/list1/:chainId", collection_controllers_1.getList);
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
checkOther_middlewares_1.checkChainIdMiddleware, checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionCanCreateMiddleware, collection_controllers_1.createCollectionDrop);
/*---------Add Put Route Collection------------*/
collectionRouter.put("/update", collection_controllers_1.updateInfo);
collectionRouter.put("/finallyDrop");
collectionRouter.put("/updateTotalItem", collection_controllers_1.updateTotalItem);
exports.default = collectionRouter;
