import express from "express";
import { checkItemExistMiddleware } from "../middlewares/checkItem.middlewares";
import { checkUserExist } from "../middlewares/checkUser.middlewares";
import {
	checkUserIsLikeItemController,
	createInteractionController,
	getListInteractionsController,
} from "../controllers/interaction.controllers";
import { checkSignatureValid } from "../middlewares/checkSignature.middlewares";
const interactionRouter = express.Router();

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

interactionRouter.post(
	"/create",
	checkSignatureValid,
	checkUserExist,
	// checkSignLikeItemMiddleware,
	checkItemExistMiddleware,
	createInteractionController,
);

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

interactionRouter.get("/userAddress/:userAddress", checkUserExist, getListInteractionsController);

interactionRouter.get("/check/itemId/:itemId/:userAddress", checkItemExistMiddleware, checkUserIsLikeItemController);

export default interactionRouter;
