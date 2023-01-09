import express from "express";
import { checkAdminAddress, checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";
import {
	getDetailINOController,
	getINOByIdController,
	getListINOByOwnerController,
	changeINOController,
} from "../controllers/ino.controller";
import { checkChainIdMiddleware } from "../middlewares/checkOther.middlewares";
import { checkCreateRequestMiddleware } from "../middlewares/manage.middlewares";
import { createRequestINOController, updateINOInfoController } from "../controllers/manage.controller";
import { checkINOExistMiddleware } from "../middlewares/ino.middleware";
import { createINOController } from "../controllers/ino.controller";
import { checkCollectionExistMiddleware } from "../middlewares/checkCollection.middlewares"
/*---------@Dev:Huy------------*/
import { getListCollectionDroppController } from "../controllers/collection.controllers";
/*---------@Dev:Huy------------*/
import { checkItemInCollection } from "../middlewares/checkItem.middleware";


const inoRouter = express.Router();

/* ******************************************
 *				 POST ROUTE				    *
 ********************************************/
/*---------@Dev:Huy------------*/
inoRouter.post("/create", 
	checkChainIdMiddleware, 
	checkCollectionExistMiddleware, 
	checkCreateRequestMiddleware,
	checkItemInCollection, 
	createINOController,
//createRequestINOController);
);

// inoRouter.post("/huy",createCollectionInf)
/* ******************************************
 *				 PUT ROUTE				    *
 ********************************************/

inoRouter.put("/inoId/:inoId", checkAdminAddress, updateINOInfoController);

/* ******************************************
 *				  GET ROUTE				    *
 ********************************************/
// /*-----------@Dev:Huy----------------*/
//  inoRouter.get("/list", getListCollectionDropp);

inoRouter.get("/list/owner/:userAddress/type/:typeINO", checkUserExistMiddleware, getListINOByOwnerController);

inoRouter.get("/inoId/:inoId", checkINOExistMiddleware, getINOByIdController);

inoRouter.get("/detail/inoId/:inoId", checkINOExistMiddleware, getDetailINOController);

inoRouter.get("/changeINO", changeINOController)

export default inoRouter;
