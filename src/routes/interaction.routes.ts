import express from "express";
import { checkItemExistMiddleware } from "../middlewares/checkItem.middlewares";
import { checkUserExist } from "../middlewares/checkUser.middlewares";
import {
	createInteractionController,
	getListItemInteractionController,
} from "../controllers/interaction.controllers";
import { checkSignatureValid } from "../middlewares/checkSignature.middlewares";
const interactionRouter = express.Router();

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

interactionRouter.post(
	"/create/userAddress/:userAddress",
	checkUserExist,
	// checkSignLikeItemMiddleware,
	createInteractionController,
);

interactionRouter.get("/userAddress/:userAddress", checkUserExist, getListItemInteractionController);
/* ******************************************
 *				GET ROUTE					*
 ********************************************/

// interactionRouter.get("/userAddress/:userAddress", checkUserExistMiddleware, getListInteractionsController);

// interactionRouter.get("/check/itemId/:itemId", checkItemExistMiddleware, checkUserIsLikeItemController);

export default interactionRouter;
