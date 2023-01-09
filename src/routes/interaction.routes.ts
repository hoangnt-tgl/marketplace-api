import express from "express";
import { checkItemExistMiddleware } from "../middlewares/checkItem.middleware";
import { checkSignLikeItemMiddleware, checkUserExistMiddleware } from "../middlewares/checkUser.middlewares";
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
	checkUserExistMiddleware,
	// checkSignLikeItemMiddleware,
	checkItemExistMiddleware,
	createInteractionController,
);

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

interactionRouter.get("/userAddress/:userAddress", checkUserExistMiddleware, getListInteractionsController);

interactionRouter.get("/check/itemId/:itemId", checkItemExistMiddleware, checkUserIsLikeItemController);

export default interactionRouter;
