"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const collection_controllers_1 = require("../controllers/collection.controllers");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkCollection_middlewares_2 = require("../middlewares/checkCollection.middlewares");
const collectionRouter = express_1.default.Router();
collectionRouter.post("/create/userAddress/:userAddress/chainId/:chainId", checkUser_middlewares_1.checkUserExist, checkOther_middlewares_1.checkChainIdValid, checkUser_middlewares_1.checkUserAuthen, checkCollection_middlewares_1.checkCollectionName, checkCollection_middlewares_2.checkCollectionDescription, collection_controllers_1.createCollection);
// get collection of one user
collectionRouter.get("/userAddress/:userAddress/chainId/:chainId", checkUser_middlewares_1.checkUserExist, checkOther_middlewares_1.checkChainIdValid, collection_controllers_1.getCollectionByUserAddress);
collectionRouter.get("/category/:category/chainId/:chainId", collection_controllers_1.getCollectionByCategory);
collectionRouter.get("/category/chainId/:chainId", collection_controllers_1.getAllCollectionByCategory);
collectionRouter.get("/get-all/chainId/:chainId", collection_controllers_1.getAllCollection);
collectionRouter.get("/get-info/collectionId/:collectionId", collection_controllers_1.getCollectionById);
collectionRouter.get("/get-new-created-collection", collection_controllers_1.getNewCollectionController);
collectionRouter.post("/top/chainId/:chainId/pageSize/:pageSize/page/:pageId", collection_controllers_1.getTopCollection);
collectionRouter.get("/get-volume-collection/:id", collection_controllers_1.getVolumeTradeCollectionController);
exports.default = collectionRouter;
