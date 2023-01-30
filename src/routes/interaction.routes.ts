import express from "express";
import { checkUserExist } from "../middlewares/checkUser.middlewares";
import { createInteractionController } from "../controllers/interaction.controllers";
const interactionRouter = express.Router();

/* ******************************************
 *				POST ROUTE					*
 ********************************************/

interactionRouter.post(
	"/create",
	checkUserExist,
	// checkSignLikeItemMiddleware,
	createInteractionController,
);

/* ******************************************
 *				GET ROUTE					*
 ********************************************/

// interactionRouter.get("/userAddress/:userAddress", checkUserExistMiddleware, getListInteractionsController);

// interactionRouter.get("/check/itemId/:itemId", checkItemExistMiddleware, checkUserIsLikeItemController);

export default interactionRouter;
