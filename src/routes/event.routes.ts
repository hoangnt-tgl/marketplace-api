import express from "express";
import { checkIsAdmin, checkUserAuthen } from "../middlewares/checkUser.middlewares";
import {
	createEventController,
	getAllEventController,
	getEventByIdController,
	predictEventController,
	cancelEventController,
	redeemEventController,
	finalizeEventController,
} from "../controllers/event.controllers";
const eventRouter = express.Router();

eventRouter.post("/create", checkUserAuthen, checkIsAdmin, createEventController);
eventRouter.get("/get-all/chainId/:chainId", getAllEventController);
eventRouter.get("/get-by-id/eventId/:eventId", getEventByIdController);
eventRouter.post("/predict/eventId/:eventId/optionId/:optionId", checkUserAuthen, predictEventController);
eventRouter.post("/cancel/eventId/:eventId", cancelEventController);
eventRouter.post("/redeem", checkUserAuthen, redeemEventController);
eventRouter.post("/finalize", checkUserAuthen, finalizeEventController);
export default eventRouter;
