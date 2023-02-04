import express from "express";
import { checkUserExist } from "../middlewares/checkUser.middlewares";
import { createInteractionController, getListItemInteractionController } from "../controllers/interaction.controllers";
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

export default interactionRouter;
