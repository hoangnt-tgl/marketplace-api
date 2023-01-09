"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("../controllers/user.controllers");
const admin_controllers_1 = require("../controllers/admin.controllers");
const advertise_controller_1 = require("../controllers/advertise.controller");
const history_controllers_1 = require("../controllers/history.controllers");
const checkAdvertise_middlewares_1 = require("../middlewares/checkAdvertise.middlewares");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const ino_middleware_1 = require("../middlewares/ino.middleware");
const ino_controller_1 = require("../controllers/ino.controller");
const manage_controller_1 = require("../controllers/manage.controller");
const manage_middlewares_1 = require("../middlewares/manage.middlewares");
const adminRouter = express_1.default.Router();
/* ******************************************
 *				  POST ROUTE				*
 ********************************************/
adminRouter.post("/login", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkAdminAddress, user_controllers_1.createUserController);
adminRouter.post("/refreshSignature", checkUser_middlewares_1.checkAdminAddress, checkSignature_middlewares_1.refreshSignature, user_controllers_1.createUserController);
// Set confirm for a collection
adminRouter.post("/setConfirm", checkSignature_middlewares_1.checkSignatureValid, 
// checkAdminAddress,
checkCollection_middlewares_1.checkCollectionExistMiddleware, admin_controllers_1.setConfirmCollectionController);
// Set advertise
adminRouter.post("/collection/setAdvertise", checkSignature_middlewares_1.checkSignatureValid, 
// checkAdminAddress,
checkCollection_middlewares_1.checkCollectionExistMiddleware, checkAdvertise_middlewares_1.checkCanSetAdvertiseMiddleware, admin_controllers_1.setAdvertiseCollectionController);
adminRouter.post("/nft/setAdvertise", checkSignature_middlewares_1.checkSignatureValid, 
// checkAdminAddress,
checkItem_middleware_1.checkItemExistMiddleware, admin_controllers_1.setAdvertiseNFTController);
// set video in top in homepage
adminRouter.post("/hotpot/write", advertise_controller_1.writeHotPotVideoController);
// blacklist manage
adminRouter.post("/blacklist/add", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkAdminAddress, admin_controllers_1.addUserToBlacklistController);
adminRouter.post("/blacklist/delete", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkAdminAddress, admin_controllers_1.removeUserToBlacklistController);
// Crawl user volume trade
adminRouter.post("/userTrade", 
// checkSignatureValid,
// checkAdminAddress,
history_controllers_1.crawlTransactionOfUserController);
/// Upload file to storage
adminRouter.post("/upload", admin_controllers_1.uploadAdminController);
// init when run server
adminRouter.post("/box/init", checkOther_middlewares_1.checkChainIdMiddleware, admin_controllers_1.initBoxController);
adminRouter.post("/collection/init", checkOther_middlewares_1.checkChainIdMiddleware, admin_controllers_1.initCollectionController);
//
adminRouter.get("/getAllUsers", admin_controllers_1.getAllUserController);
adminRouter.get("/getAllCollections", admin_controllers_1.getAllCollectionsController);
adminRouter.get("/items/collectionId/:collectionId", admin_controllers_1.getItemsByCollectionIdController);
// INO ROUTE
adminRouter.post("/nft/import", checkOther_middlewares_1.checkChainIdMiddleware, admin_controllers_1.importNFTForINOController);
adminRouter.post("/ino/create", checkOther_middlewares_1.checkChainIdMiddleware, ino_middleware_1.checkCreateINOMiddleware, ino_controller_1.createINOController);
adminRouter.post("/ino/query/pageSize/:pageSize/page/:pageId", checkOther_middlewares_1.checkChainIdMiddleware, ino_controller_1.queryINOController);
/// REQUEST INO ROUTE
adminRouter.post("/ino/request/list/pageSize/:pageSize/page/:pageId", manage_middlewares_1.deleteRequestMiddleware, checkOther_middlewares_1.checkPageIdMiddleware, manage_controller_1.getListRequestController);
adminRouter.get("/ino/request/detail/:requestId", manage_middlewares_1.checkRequestINOExistMiddleware, manage_controller_1.getRequestDetailController);
adminRouter.put("/ino/request/pin/:requestId", manage_middlewares_1.checkRequestINOExistMiddleware, manage_controller_1.pinRequestController);
adminRouter.put("/ino/request/approve/:requestId", manage_middlewares_1.checkRequestINOExistMiddleware, manage_controller_1.approveRequestController);
exports.default = adminRouter;
