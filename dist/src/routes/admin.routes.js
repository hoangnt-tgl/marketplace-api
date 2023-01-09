"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
const admin_controller_1 = require("../controllers/admin.controller");
const checkAdvertise_middlewares_1 = require("../middlewares/checkAdvertise.middlewares");
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const history_controllers_1 = require("../controllers/history.controllers");
const checkSignature_middlewares_1 = require("../middlewares/checkSignature.middlewares");
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const adminRouter = express_1.default.Router();
/* ******************************************
 *				  POST ROUTE				*
 ********************************************/
adminRouter.post("/setConfirm", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, checkCollection_middlewares_1.checkCollectionExistMiddleware, admin_controller_1.setConfirmCollectionCollection);
adminRouter.post("/collection/setAdvertise", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, checkCollection_middlewares_1.checkCollectionExistMiddleware, checkAdvertise_middlewares_1.checkCanSetAdvertiseMiddleware, admin_controller_1.setAdvertiseCollectionController);
adminRouter.post("/nft/setAdvertise", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, checkItem_middleware_1.checkItemExistMiddleware, admin_controller_1.setAdvertiseNFTController);
adminRouter.post("/blacklist/add", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, admin_controller_1.addUserToBlacklistController);
adminRouter.post("/blacklist/delete", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, admin_controller_1.removeUserToBlacklistController);
adminRouter.post("/userTrade", checkSignature_middlewares_1.checkSignatureValid, checkUser_middlewares_1.checkUserMatchOnBlockchain, history_controllers_1.crawlTransactionOfUserController);
exports.default = adminRouter;
