"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkUser_middlewares_1 = require("../middlewares/checkUser.middlewares");
const ino_controller_1 = require("../controllers/ino.controller");
const checkOther_middlewares_1 = require("../middlewares/checkOther.middlewares");
const manage_middlewares_1 = require("../middlewares/manage.middlewares");
const manage_controller_1 = require("../controllers/manage.controller");
const ino_middleware_1 = require("../middlewares/ino.middleware");
const ino_controller_2 = require("../controllers/ino.controller");
const checkCollection_middlewares_1 = require("../middlewares/checkCollection.middlewares");
/*---------@Dev:Huy------------*/
const checkItem_middleware_1 = require("../middlewares/checkItem.middleware");
const inoRouter = express_1.default.Router();
/* ******************************************
 *				 POST ROUTE				    *
 ********************************************/
/*---------@Dev:Huy------------*/
inoRouter.post("/create", checkOther_middlewares_1.checkChainIdMiddleware, checkCollection_middlewares_1.checkCollectionExistMiddleware, manage_middlewares_1.checkCreateRequestMiddleware, checkItem_middleware_1.checkItemInCollection, ino_controller_2.createINOController);
// inoRouter.post("/huy",createCollectionInf)
/* ******************************************
 *				 PUT ROUTE				    *
 ********************************************/
inoRouter.put("/inoId/:inoId", checkUser_middlewares_1.checkAdminAddress, manage_controller_1.updateINOInfoController);
/* ******************************************
 *				  GET ROUTE				    *
 ********************************************/
// /*-----------@Dev:Huy----------------*/
//  inoRouter.get("/list", getListCollectionDropp);
inoRouter.get("/list/owner/:userAddress/type/:typeINO", checkUser_middlewares_1.checkUserExistMiddleware, ino_controller_1.getListINOByOwnerController);
inoRouter.get("/inoId/:inoId", ino_middleware_1.checkINOExistMiddleware, ino_controller_1.getINOByIdController);
inoRouter.get("/detail/inoId/:inoId", ino_middleware_1.checkINOExistMiddleware, ino_controller_1.getDetailINOController);
exports.default = inoRouter;
