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
collectionRouter.get("/topCategory", collection_controllers_1.getCollectionCategoryController);
collectionRouter.get("/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, collection_controllers_1.getCollectionByIdController);
collectionRouter.get("/detail/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, collection_controllers_1.getCollectionDetailController);
collectionRouter.get("/category", collection_controllers_1.getCategoryController);
collectionRouter.get("/userAddress/:userAddress", checkUser_middlewares_1.checkUserExistMiddleware, collection_controllers_1.getCollectionByOwnerItemController);
// collectionRouter.get("/category", getCollectionCategoryController);
collectionRouter.post("/top/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, collection_controllers_1.getTopCollectionController);
/* ******************************************
 *				POST ROUTE					*
 ********************************************/
collectionRouter.post("/query/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkPageIdMiddleware, collection_controllers_1.queryCollectionIdsInPageController);
collectionRouter.post("/upload", collection_controllers_1.uploadCollectionImageController);
collectionRouter.post("/create", checkUser_middlewares_1.checkUserMatchOnBlockchain, checkOther_middlewares_1.checkChainIdMiddleware, checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionCanCreateMiddleware, collection_controllers_1.createCollectionController);
collectionRouter.post("/checkName", checkOther_middlewares_1.checkChainIdMiddleware, collection_controllers_1.isCollectionNameExistController);
/* ******************************************
 *				PUT ROUTE					*
 ********************************************/
collectionRouter.put("/collectionId/:collectionId", checkCollection_middlewares_1.checkCollectionExistMiddleware, checkUser_middlewares_1.checkUserExistMiddleware, checkCollection_middlewares_1.checkCollectionNameExistMiddleware, checkCollection_middlewares_1.checkCollectionCanUpdateMiddleware, collection_controllers_1.updateCollectionController);
exports.default = collectionRouter;
